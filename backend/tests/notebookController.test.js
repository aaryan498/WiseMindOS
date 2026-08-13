import assert from 'node:assert/strict';
import test, { afterEach } from 'node:test';

import { deleteNotebook, reorderNotebooks, createNotebook, updateNotebook } from '../controllers/notebookController.js';
import notebookModel from '../models/notebookModel.js';
import pageModel from '../models/pageModel.js';

const originals = [];

function mockResponse() {
    return {
        body: undefined,
        json(payload) {
            this.body = payload;
            return payload;
        },
    };
}

function replaceProperty(target, property, value) {
    originals.push([target, property, target[property]]);
    target[property] = value;
}

function mockFindNotebooks(notebooks) {
    replaceProperty(notebookModel, 'find', () => ({
        sort: async () => notebooks,
    }));
}

function expectedBulkOps(notebooks) {
    return notebooks.map((notebook, index) => {
        if (notebook.order === index + 1) return null;
        return {
            updateOne: {
                filter: { _id: notebook._id },
                update: { $set: { order: index + 1 } },
            },
        };
    }).filter(Boolean);
}

afterEach(() => {
    while (originals.length) {
        const [target, property, value] = originals.pop();
        target[property] = value;
    }
});

test('reorderNotebooks compacts multiple gaps into a continuous sequence', async () => {
    const notebooks = [
        { _id: 'notebook-1', name: 'Notes', order: 1 },
        { _id: 'notebook-3', name: 'Ideas', order: 3 },
        { _id: 'notebook-5', name: 'Tasks', order: 5 },
    ];
    let bulkOps = [];

    mockFindNotebooks(notebooks);
    replaceProperty(notebookModel, 'bulkWrite', async (ops) => {
        bulkOps = ops;
    });

    const count = await reorderNotebooks('user-1');

    assert.equal(count, 3);
    assert.deepEqual(bulkOps, expectedBulkOps(notebooks));
});

test('reorderNotebooks shifts notebooks after deleting the first one', async () => {
    const notebooks = [
        { _id: 'notebook-2', name: 'Ideas', order: 2 },
        { _id: 'notebook-3', name: 'Tasks', order: 3 },
    ];
    let bulkOps = [];

    mockFindNotebooks(notebooks);
    replaceProperty(notebookModel, 'bulkWrite', async (ops) => {
        bulkOps = ops;
    });

    await reorderNotebooks('user-1');

    assert.deepEqual(bulkOps, expectedBulkOps(notebooks));
});

test('reorderNotebooks keeps trailing notebooks sequential after deleting the last one', async () => {
    const notebooks = [
        { _id: 'notebook-1', name: 'Notes', order: 1 },
        { _id: 'notebook-2', name: 'Ideas', order: 2 },
    ];
    let bulkOps = [];

    mockFindNotebooks(notebooks);
    replaceProperty(notebookModel, 'bulkWrite', async (ops) => {
        bulkOps = ops;
    });

    await reorderNotebooks('user-1');

    assert.deepEqual(bulkOps, expectedBulkOps(notebooks));
});

test('reorderNotebooks skips bulkWrite when no notebooks remain', async () => {
    let bulkWriteCalled = false;

    mockFindNotebooks([]);
    replaceProperty(notebookModel, 'bulkWrite', async () => {
        bulkWriteCalled = true;
    });

    const count = await reorderNotebooks('user-1');

    assert.equal(count, 0);
    assert.equal(bulkWriteCalled, false);
});

test('deleteNotebook reorders remaining notebooks after any notebook is removed', async () => {
    const res = mockResponse();
    const deletedNotebook = {
        _id: 'notebook-2',
        order: 2,
    };
    const remainingNotebooks = [
        { _id: 'notebook-1', name: 'Notes', order: 1 },
        { _id: 'notebook-3', name: 'Tasks', order: 3 },
        { _id: 'notebook-4', name: 'Ideas', order: 4 },
    ];
    let bulkOps = [];

    let pageDeleteFilter;

    replaceProperty(notebookModel, 'findOneAndDelete', async () => deletedNotebook);
    replaceProperty(pageModel, 'deleteMany', async (filter) => {
        pageDeleteFilter = filter;
    });
    replaceProperty(notebookModel, 'find', () => ({
        sort: async () => remainingNotebooks,
    }));
    replaceProperty(notebookModel, 'bulkWrite', async (ops) => {
        bulkOps = ops;
    });

    await deleteNotebook({
        user: { id: 'user-1' },
        body: {
            notebookId: 'notebook-2',
        },
        user: { id: 'user-1' }
    }, res, () => {});

    assert.equal(res.body.success, true);
    assert.equal(res.body.notebooks.length, 3);
    assert.deepEqual(pageDeleteFilter, {
        notebookId: 'notebook-2',
        userId: 'user-1',
    });
    assert.deepEqual(bulkOps, expectedBulkOps(remainingNotebooks));
});

test('deleteNotebook only deletes pages owned by the authenticated user', async () => {
    const res = mockResponse();
    let pageDeleteFilter;

    replaceProperty(notebookModel, 'findOneAndDelete', async () => ({
        _id: 'notebook-1',
    }));
    replaceProperty(pageModel, 'deleteMany', async (filter) => {
        pageDeleteFilter = filter;
    });
    mockFindNotebooks([]);
    replaceProperty(notebookModel, 'bulkWrite', async () => {});

    await deleteNotebook({
        user: { id: 'user-42' },
        body: {
            notebookId: 'notebook-1',
        },
        user: { id: 'user-42' }
    }, res, () => {});

    assert.equal(res.body.success, true);
    assert.deepEqual(pageDeleteFilter, {
        notebookId: 'notebook-1',
        userId: 'user-42',
    });
});

test('deleteNotebook does not reorder when the notebook does not exist', async () => {
    const res = mockResponse();
    let bulkWriteCalled = false;
    let deleteManyCalled = false;

    replaceProperty(notebookModel, 'findOneAndDelete', async () => null);
    replaceProperty(pageModel, 'deleteMany', async () => {
        deleteManyCalled = true;
    });
    replaceProperty(notebookModel, 'bulkWrite', async () => {
        bulkWriteCalled = true;
    });

    await deleteNotebook({
        user: { id: 'user-1' },
        body: {
            notebookId: 'missing-notebook',
        },
        user: { id: 'user-1' }
    }, res, () => {});

    assert.deepEqual(res.body, {
        success: false,
        message: 'Notebook not found',
    });
    assert.equal(deleteManyCalled, false);
    assert.equal(bulkWriteCalled, false);
});

test('createNotebook rejects duplicate names (case-insensitive)', async () => {
    const res = mockResponse();
    replaceProperty(notebookModel, 'findOne', async () => ({
        _id: 'notebook-1',
        name: 'Ideas'
    }));

    await createNotebook({
        body: { name: '  ideas ' },
        user: { id: 'user-1' }
    }, res, () => {});

    assert.deepEqual(res.body, {
        success: false,
        message: 'A notebook with this name already exists'
    });
});

test('createNotebook creates a valid notebook successfully', async () => {
    const res = mockResponse();
    replaceProperty(notebookModel, 'findOne', async () => null);
    replaceProperty(notebookModel, 'countDocuments', async () => 2);
    let savedNotebook;
    replaceProperty(notebookModel.prototype, 'save', async function save() {
        savedNotebook = this;
        return this;
    });

    await createNotebook({
        body: { name: 'New Learnings' },
        user: { id: '507f1f77bcf86cd799439011' }
    }, res, () => {});

    assert.equal(res.body.success, true);
    assert.equal(savedNotebook.name, 'New Learnings');
    assert.equal(savedNotebook.order, 3);
    assert.equal(savedNotebook.userId.toString(), '507f1f77bcf86cd799439011');
});

test('updateNotebook rejects duplicate names (excluding itself)', async () => {
    const res = mockResponse();
    replaceProperty(notebookModel, 'findOne', async () => ({
        _id: 'notebook-2',
        name: 'Work Tasks'
    }));

    await updateNotebook({
        body: {
            notebookId: 'notebook-1',
            name: '  work tasks '
        },
        user: { id: 'user-1' }
    }, res, () => {});

    assert.deepEqual(res.body, {
        success: false,
        message: 'A notebook with this name already exists'
    });
});

test('updateNotebook updates notebook name successfully', async () => {
    const res = mockResponse();
    const updatedNotebook = {
        _id: 'notebook-1',
        name: 'Renamed Tasks'
    };
    replaceProperty(notebookModel, 'findOne', async () => null);
    replaceProperty(notebookModel, 'findOneAndUpdate', async () => updatedNotebook);

    await updateNotebook({
        body: {
            notebookId: 'notebook-1',
            name: 'Renamed Tasks'
        },
        user: { id: 'user-1' }
    }, res, () => {});

    assert.equal(res.body.success, true);
    assert.deepEqual(res.body.notebook, updatedNotebook);
});

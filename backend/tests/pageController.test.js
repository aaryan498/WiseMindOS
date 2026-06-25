import assert from 'node:assert/strict';
import test, { afterEach } from 'node:test';

import { deletePage, reorderNotebookPages, updatePage } from '../controllers/pageController.js';
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

function mockFindPages(pages) {
    replaceProperty(pageModel, 'find', () => ({
        sort: async () => pages,
    }));
}

function expectedBulkOps(pages) {
    return pages.map((page, index) => {
        const newOrder = index + 1;
        return {
            updateOne: {
                filter: { _id: page._id },
                update: { $set: { order: newOrder, title: `Page ${newOrder}` } },
            },
        };
    });
}

afterEach(() => {
    while (originals.length) {
        const [target, property, value] = originals.pop();
        target[property] = value;
    }
});

test('reorderNotebookPages compacts multiple gaps into a continuous sequence', async () => {
    const pages = [
        { _id: 'page-1', title: 'Page 1', order: 1 },
        { _id: 'page-3', title: 'Page 3', order: 3 },
        { _id: 'page-5', title: 'Page 5', order: 5 },
        { _id: 'page-7', title: 'Page 7', order: 7 },
    ];
    let bulkOps;

    mockFindPages(pages);
    replaceProperty(pageModel, 'bulkWrite', async (ops) => {
        bulkOps = ops;
    });

    const count = await reorderNotebookPages('notebook-1', 'user-1');

    assert.equal(count, 4);
    assert.deepEqual(bulkOps, expectedBulkOps(pages));
});

test('reorderNotebookPages shifts pages after deleting the first page', async () => {
    const pages = [
        { _id: 'page-2', title: 'Page 2', order: 2 },
        { _id: 'page-3', title: 'Page 3', order: 3 },
        { _id: 'page-4', title: 'Page 4', order: 4 },
    ];
    let bulkOps;

    mockFindPages(pages);
    replaceProperty(pageModel, 'bulkWrite', async (ops) => {
        bulkOps = ops;
    });

    await reorderNotebookPages('notebook-1', 'user-1');

    assert.deepEqual(bulkOps, expectedBulkOps(pages));
});

test('reorderNotebookPages keeps trailing pages sequential after deleting the last page', async () => {
    const pages = [
        { _id: 'page-1', title: 'Page 1', order: 1 },
        { _id: 'page-2', title: 'Page 2', order: 2 },
    ];
    let bulkOps;

    mockFindPages(pages);
    replaceProperty(pageModel, 'bulkWrite', async (ops) => {
        bulkOps = ops;
    });

    await reorderNotebookPages('notebook-1', 'user-1');

    assert.deepEqual(bulkOps, expectedBulkOps(pages));
});

test('reorderNotebookPages skips bulkWrite when no pages remain', async () => {
    let bulkWriteCalled = false;

    mockFindPages([]);
    replaceProperty(pageModel, 'bulkWrite', async () => {
        bulkWriteCalled = true;
    });

    const count = await reorderNotebookPages('notebook-1', 'user-1');

    assert.equal(count, 0);
    assert.equal(bulkWriteCalled, false);
});

test('deletePage reorders remaining pages after any page is removed', async () => {
    const res = mockResponse();
    const deletedPage = {
        _id: 'page-2',
        order: 2,
        notebookId: 'notebook-1',
    };
    const notebook = {
        pageCount: 4,
        saveCalled: false,
        async save() {
            this.saveCalled = true;
        },
    };
    const remainingPages = [
        { _id: 'page-1', title: 'Page 1', order: 1 },
        { _id: 'page-3', title: 'Page 3', order: 3 },
        { _id: 'page-4', title: 'Page 4', order: 4 },
    ];
    let bulkOps;

    replaceProperty(pageModel, 'findOneAndDelete', async () => deletedPage);
    replaceProperty(notebookModel, 'findOne', async () => notebook);
    replaceProperty(pageModel, 'find', () => ({
        sort: async () => remainingPages.map((page, index) => ({
            ...page,
            title: `Page ${index + 1}`,
            order: index + 1,
        })),
    }));
    replaceProperty(pageModel, 'bulkWrite', async (ops) => {
        bulkOps = ops;
    });

    await deletePage({
        body: {
            pageId: 'page-2',
            notebookId: 'notebook-1',
            userId: 'user-1',
        },
    }, res);

    assert.equal(res.body.success, true);
    assert.equal(notebook.pageCount, 3);
    assert.equal(res.body.pages.length, 3);
    assert.deepEqual(bulkOps, expectedBulkOps(remainingPages));
});

test('reorderNotebookPages renames all pages to sequential titles', async () => {
    const pages = [
        { _id: 'page-1', title: 'Meeting Notes', order: 1 },
        { _id: 'page-3', title: 'Page 3', order: 3 },
    ];
    let bulkOps;

    mockFindPages(pages);
    replaceProperty(pageModel, 'bulkWrite', async (ops) => {
        bulkOps = ops;
    });

    await reorderNotebookPages('notebook-1', 'user-1');

    assert.deepEqual(bulkOps, [
        {
            updateOne: {
                filter: { _id: 'page-1' },
                update: { $set: { order: 1, title: 'Page 1' } },
            },
        },
        {
            updateOne: {
                filter: { _id: 'page-3' },
                update: { $set: { order: 2, title: 'Page 2' } },
            },
        },
    ]);
});

test('updatePage returns validation error when content is missing', async () => {
    const res = mockResponse();
    let findOneAndUpdateCalled = false;

    replaceProperty(pageModel, 'findOneAndUpdate', async () => {
        findOneAndUpdateCalled = true;
    });

    await updatePage({
        body: {
            pageId: 'page-1',
            userId: 'user-1',
        },
    }, res);

    assert.deepEqual(res.body, {
        success: false,
        message: 'Content is required',
    });
    assert.equal(findOneAndUpdateCalled, false);
});

test('updatePage returns validation error when content is null', async () => {
    const res = mockResponse();
    let findOneAndUpdateCalled = false;

    replaceProperty(pageModel, 'findOneAndUpdate', async () => {
        findOneAndUpdateCalled = true;
    });

    await updatePage({
        body: {
            pageId: 'page-1',
            content: null,
            userId: 'user-1',
        },
    }, res);

    assert.deepEqual(res.body, {
        success: false,
        message: 'Content is required',
    });
    assert.equal(findOneAndUpdateCalled, false);
});

test('updatePage returns validation error when content is not a string', async () => {
    const res = mockResponse();
    let findOneAndUpdateCalled = false;

    replaceProperty(pageModel, 'findOneAndUpdate', async () => {
        findOneAndUpdateCalled = true;
    });

    await updatePage({
        body: {
            pageId: 'page-1',
            content: 12345,
            userId: 'user-1',
        },
    }, res);

    assert.deepEqual(res.body, {
        success: false,
        message: 'Content must be a string',
    });
    assert.equal(findOneAndUpdateCalled, false);
});

test('updatePage returns validation error when content exceeds 10KB', async () => {
    const res = mockResponse();
    let findOneAndUpdateCalled = false;

    replaceProperty(pageModel, 'findOneAndUpdate', async () => {
        findOneAndUpdateCalled = true;
    });

    await updatePage({
        body: {
            pageId: 'page-1',
            content: 'x'.repeat(10001),
            userId: 'user-1',
        },
    }, res);

    assert.deepEqual(res.body, {
        success: false,
        message: 'Max 10KB content allowed',
    });
    assert.equal(findOneAndUpdateCalled, false);
});

test('updatePage persists valid content', async () => {
    const res = mockResponse();
    const updatedPage = {
        _id: 'page-1',
        content: 'Hello world',
    };
    let updatePayload;

    replaceProperty(pageModel, 'findOneAndUpdate', async (_filter, update) => {
        updatePayload = update;
        return updatedPage;
    });

    await updatePage({
        body: {
            pageId: 'page-1',
            content: 'Hello world',
            userId: 'user-1',
        },
    }, res);

    assert.deepEqual(res.body, {
        success: true,
        page: updatedPage,
    });
    assert.equal(updatePayload.content, 'Hello world');
});

test('deletePage does not reorder when the page does not exist', async () => {
    const res = mockResponse();
    let bulkWriteCalled = false;

    replaceProperty(pageModel, 'findOneAndDelete', async () => null);
    replaceProperty(pageModel, 'bulkWrite', async () => {
        bulkWriteCalled = true;
    });

    await deletePage({
        body: {
            pageId: 'missing-page',
            notebookId: 'notebook-1',
            userId: 'user-1',
        },
    }, res);

    assert.deepEqual(res.body, {
        success: false,
        message: 'Page not found',
    });
    assert.equal(bulkWriteCalled, false);
});

import assert from 'node:assert/strict';
import test, { afterEach } from 'node:test';

import { createPage, deletePage } from '../controllers/pageController.js';
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

function createAtomicNotebookStore({ notebookId = 'notebook-1', userId = 'user-1', pageCount = 0 } = {}) {
    let currentPageCount = pageCount;

    return {
        get pageCount() {
            return currentPageCount;
        },
        async findOneAndUpdate(filter, update, options) {
            await new Promise((resolve) => setImmediate(resolve));

            if (filter._id !== notebookId || filter.userId !== userId) {
                return null;
            }

            if (filter.pageCount?.$lt !== undefined && currentPageCount >= filter.pageCount.$lt) {
                return null;
            }

            if (filter.pageCount?.$gt !== undefined && currentPageCount <= filter.pageCount.$gt) {
                return null;
            }

            if (update.$inc?.pageCount) {
                currentPageCount += update.$inc.pageCount;
            }

            const notebook = { _id: notebookId, userId, pageCount: currentPageCount };

            if (options?.new) {
                return notebook;
            }

            return {
                ...notebook,
                pageCount: currentPageCount - (update.$inc?.pageCount || 0),
            };
        },
        async exists(filter) {
            return filter._id === notebookId && filter.userId === userId;
        },
    };
}

afterEach(() => {
    while (originals.length) {
        const [target, property, value] = originals.pop();
        target[property] = value;
    }
});

test('createPage atomically increments pageCount with $inc', async () => {
    const res = mockResponse();
    const store = createAtomicNotebookStore({ pageCount: 4 });
    let updateArgs;

    replaceProperty(notebookModel, 'findOneAndUpdate', async (...args) => {
        updateArgs = args;
        return store.findOneAndUpdate(...args);
    });
    replaceProperty(notebookModel, 'exists', store.exists.bind(store));
    replaceProperty(pageModel.prototype, 'save', async function save() {
        return this;
    });

    await createPage({
        body: {
            notebookId: 'notebook-1',
            userId: 'user-1',
        },
    }, res);

    assert.equal(res.body.success, true);
    assert.equal(res.body.page.title, 'Page 5');
    assert.equal(res.body.page.order, 5);
    assert.deepEqual(updateArgs[1], { $inc: { pageCount: 1 } });
    assert.deepEqual(updateArgs[0].pageCount, { $lt: 100 });
    assert.equal(store.pageCount, 5);
});

test('createPage returns max pages error when notebook is full', async () => {
    const res = mockResponse();
    const store = createAtomicNotebookStore({ pageCount: 100 });

    replaceProperty(notebookModel, 'findOneAndUpdate', store.findOneAndUpdate.bind(store));
    replaceProperty(notebookModel, 'exists', store.exists.bind(store));

    await createPage({
        body: {
            notebookId: 'notebook-1',
            userId: 'user-1',
        },
    }, res);

    assert.deepEqual(res.body, {
        success: false,
        message: 'Max 100 pages allowed',
    });
    assert.equal(store.pageCount, 100);
});

test('createPage returns not found when notebook does not exist', async () => {
    const res = mockResponse();

    replaceProperty(notebookModel, 'findOneAndUpdate', async () => null);
    replaceProperty(notebookModel, 'exists', async () => null);

    await createPage({
        body: {
            notebookId: 'missing-notebook',
            userId: 'user-1',
        },
    }, res);

    assert.deepEqual(res.body, {
        success: false,
        message: 'Notebook not found',
    });
});

test('deletePage atomically decrements pageCount with $inc', async () => {
    const res = mockResponse();
    const store = createAtomicNotebookStore({ pageCount: 3 });
    let updateArgs;

    replaceProperty(pageModel, 'findOneAndDelete', async () => ({ _id: 'page-1' }));
    replaceProperty(notebookModel, 'findOneAndUpdate', async (...args) => {
        updateArgs = args;
        return store.findOneAndUpdate(...args);
    });

    await deletePage({
        body: {
            pageId: 'page-1',
            notebookId: 'notebook-1',
            userId: 'user-1',
        },
    }, res);

    assert.equal(res.body.success, true);
    assert.deepEqual(updateArgs[1], { $inc: { pageCount: -1 } });
    assert.deepEqual(updateArgs[0].pageCount, { $gt: 0 });
    assert.equal(store.pageCount, 2);
});

test('deletePage does not decrement pageCount below zero', async () => {
    const res = mockResponse();
    const store = createAtomicNotebookStore({ pageCount: 0 });

    replaceProperty(pageModel, 'findOneAndDelete', async () => ({ _id: 'page-1' }));
    replaceProperty(notebookModel, 'findOneAndUpdate', store.findOneAndUpdate.bind(store));

    await deletePage({
        body: {
            pageId: 'page-1',
            notebookId: 'notebook-1',
            userId: 'user-1',
        },
    }, res);

    assert.equal(res.body.success, true);
    assert.equal(store.pageCount, 0);
});

test('concurrent page creation keeps pageCount accurate', async () => {
    const store = createAtomicNotebookStore({ pageCount: 0 });
    const createdPages = [];

    replaceProperty(notebookModel, 'findOneAndUpdate', store.findOneAndUpdate.bind(store));
    replaceProperty(notebookModel, 'exists', store.exists.bind(store));
    replaceProperty(pageModel.prototype, 'save', async function save() {
        createdPages.push({ title: this.title, order: this.order });
        return this;
    });

    const responses = Array.from({ length: 25 }, () => mockResponse());
    await Promise.all(responses.map((res) => createPage({
        body: {
            notebookId: 'notebook-1',
            userId: 'user-1',
        },
    }, res)));

    assert.equal(store.pageCount, 25);
    assert.equal(createdPages.length, 25);
    assert.equal(responses.every((res) => res.body.success), true);

    const orders = createdPages.map((page) => page.order).sort((a, b) => a - b);
    assert.deepEqual(orders, Array.from({ length: 25 }, (_, index) => index + 1));
});

test('concurrent page deletion keeps pageCount accurate', async () => {
    const store = createAtomicNotebookStore({ pageCount: 20 });

    replaceProperty(pageModel, 'findOneAndDelete', async () => ({ _id: 'page-1' }));
    replaceProperty(notebookModel, 'findOneAndUpdate', store.findOneAndUpdate.bind(store));

    const responses = Array.from({ length: 20 }, (_, index) => ({
        res: mockResponse(),
        pageId: `page-${index + 1}`,
    }));
    await Promise.all(responses.map(({ res, pageId }) => deletePage({
        body: {
            pageId,
            notebookId: 'notebook-1',
            userId: 'user-1',
        },
    }, res)));

    assert.equal(store.pageCount, 0);
    assert.equal(responses.every(({ res }) => res.body.success), true);
});

test('concurrent page creation and deletion keeps pageCount accurate', async () => {
    const store = createAtomicNotebookStore({ pageCount: 10 });

    replaceProperty(notebookModel, 'findOneAndUpdate', store.findOneAndUpdate.bind(store));
    replaceProperty(notebookModel, 'exists', store.exists.bind(store));
    replaceProperty(pageModel.prototype, 'save', async function save() {
        return this;
    });
    replaceProperty(pageModel, 'findOneAndDelete', async () => ({ _id: 'page-1' }));

    const operations = [
        ...Array.from({ length: 15 }, () => createPage({
            body: {
                notebookId: 'notebook-1',
                userId: 'user-1',
            },
        }, mockResponse())),
        ...Array.from({ length: 10 }, (_, index) => deletePage({
            body: {
                pageId: `page-${index + 1}`,
                notebookId: 'notebook-1',
                userId: 'user-1',
            },
        }, mockResponse())),
    ];

    await Promise.all(operations);

    assert.equal(store.pageCount, 15);
});

import assert from 'node:assert/strict';
import test from 'node:test';

import taskModel from '../models/taskModel.js';
import goalModel from '../models/goalModel.js';
import projectModel from '../models/projectModel.js';

function indexKeys(model) {
    return model.schema.indexes().map(([keys]) => keys);
}

test('taskModel has indexes on userId, userId+goalId, and userId+projectId', () => {
    const keys = indexKeys(taskModel);

    assert.ok(
        keys.some((k) => k.userId === 1 && Object.keys(k).length === 1),
        'expected a single-field index on userId',
    );
    assert.ok(
        keys.some((k) => k.userId === 1 && k.goalId === 1 && Object.keys(k).length === 2),
        'expected a compound index on userId+goalId',
    );
    assert.ok(
        keys.some((k) => k.userId === 1 && k.projectId === 1 && Object.keys(k).length === 2),
        'expected a compound index on userId+projectId',
    );
});

test('goalModel has an index on userId', () => {
    const keys = indexKeys(goalModel);
    assert.ok(
        keys.some((k) => k.userId === 1 && Object.keys(k).length === 1),
        'expected a single-field index on userId',
    );
});

test('projectModel has an index on userId', () => {
    const keys = indexKeys(projectModel);
    assert.ok(
        keys.some((k) => k.userId === 1 && Object.keys(k).length === 1),
        'expected a single-field index on userId',
    );
});

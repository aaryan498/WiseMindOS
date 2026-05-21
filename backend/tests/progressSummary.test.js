import assert from 'node:assert/strict';
import test from 'node:test';
import { emptyProgressSummary, summarizeTaskProgress } from '../utils/progressSummary.js';

test('summarizeTaskProgress groups totals and completed counts by id', () => {
    const summary = summarizeTaskProgress([
        { goalId: 'goal-a', completed: true },
        { goalId: 'goal-a', completed: false },
        { goalId: 'goal-b', completed: true },
        { goalId: 'goal-b', completed: true },
        { goalId: null, completed: true }
    ], 'goalId');

    assert.deepEqual(summary.get('goal-a'), {
        totalTasks: 2,
        tasksCompleted: 1,
        progress: 50
    });
    assert.deepEqual(summary.get('goal-b'), {
        totalTasks: 2,
        tasksCompleted: 2,
        progress: 100
    });
    assert.equal(summary.has('null'), false);
});

test('emptyProgressSummary keeps zero-task response shape stable', () => {
    assert.deepEqual(emptyProgressSummary, {
        totalTasks: 0,
        tasksCompleted: 0,
        progress: 0
    });
});

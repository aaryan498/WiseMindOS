import assert from 'node:assert/strict';
import test, { afterEach } from 'node:test';
import jwt from 'jsonwebtoken';

import { createGoal, getGoals } from '../controllers/goalController.js';
import { getWeeklyStats, saveDailyStats } from '../controllers/statsController.js';
import { toggleTaskCompletion } from '../controllers/taskController.js';
import authUser from '../middlewares/auth.js';
import dailyPlanModel from '../models/dailyPlanModel.js';
import dailyStatsModel from '../models/dailyStatsModel.js';
import goalModel from '../models/goalModel.js';
import taskModel from '../models/taskModel.js';

const originals = [];

function mockResponse() {
    return {
        body: undefined,
        json(payload) {
            this.body = payload;
            return payload;
        }
    };
}

function replaceProperty(target, property, value) {
    originals.push([target, property, target[property]]);
    target[property] = value;
}

afterEach(() => {
    while (originals.length) {
        const [target, property, value] = originals.pop();
        target[property] = value;
    }
});

test('createGoal returns a validation response when title is missing', async () => {
    const res = mockResponse();

    await createGoal({ body: { userId: 'user-1' } }, res);

    assert.deepEqual(res.body, {
        success: false,
        message: 'Title is required'
    });
});

test('createGoal persists default values for a valid goal', async () => {
    const res = mockResponse();
    let savedGoal;
    replaceProperty(goalModel.prototype, 'save', async function save() {
        savedGoal = this;
        return this;
    });

    await createGoal({
        body: {
            userId: '507f1f77bcf86cd799439011',
            title: 'Ship open-source work'
        }
    }, res);

    assert.equal(res.body.success, true);
    assert.equal(res.body.message, 'Goal Created Successfully !');
    assert.equal(savedGoal.type, 'personal');
    assert.equal(savedGoal.description, '');
    assert.equal(savedGoal.deadline, null);
});

test('getGoals calculates progress from completed goal tasks', async () => {
    const res = mockResponse();
    const goal = {
        _id: 'goal-1',
        title: 'Testing coverage'
    };

    replaceProperty(goalModel, 'find', () => ({
        async lean() {
            return [goal];
        }
    }));
    replaceProperty(taskModel, 'find', () => ({
        async lean() {
            return [
                { goalId: 'goal-1', completed: true },
                { goalId: 'goal-1', completed: false },
                { goalId: 'goal-1', completed: true }
            ];
        }
    }));

    await getGoals({ body: { userId: 'user-1' } }, res);

    assert.equal(res.body.success, true);
    assert.equal(res.body.goals[0].progress, 67);
});

test('toggleTaskCompletion updates task source of truth and daily plan mirror', async () => {
    const res = mockResponse();
    const task = {
        completed: false,
        saveCalled: false,
        async save() {
            this.saveCalled = true;
        }
    };
    const plannedTask = { source: 'task', taskId: { toString: () => 'task-1' }, completed: false };
    const dailyPlan = {
        plannedTasks: [plannedTask],
        saveCalled: false,
        async save() {
            this.saveCalled = true;
        }
    };

    replaceProperty(taskModel, 'findOne', async () => task);
    replaceProperty(dailyPlanModel, 'findOne', async () => dailyPlan);

    await toggleTaskCompletion({
        body: {
            userId: 'user-1',
            taskId: 'task-1'
        }
    }, res);

    assert.equal(res.body.success, true);
    assert.equal(task.completed, true);
    assert.equal(task.saveCalled, true);
    assert.equal(plannedTask.completed, true);
    assert.equal(dailyPlan.saveCalled, true);
});

test('saveDailyStats updates the normalized daily document directly', async () => {
    const res = mockResponse();
    let capturedFilter;
    let capturedUpdate;
    let capturedOptions;

    replaceProperty(dailyStatsModel, 'findOneAndUpdate', async (filter, update, options) => {
        capturedFilter = filter;
        capturedUpdate = update;
        capturedOptions = options;
        return update;
    });

    await saveDailyStats({
        body: {
            userId: '507f1f77bcf86cd799439011',
            productivity: 82,
            discipline: 75
        },
        headers: {}
    }, res);

    assert.equal(res.body.success, true);
    assert.equal(capturedFilter.userId, '507f1f77bcf86cd799439011');
    assert.ok(capturedFilter.date instanceof Date);
    assert.equal(capturedFilter.date.getUTCHours(), 0);
    assert.equal(capturedFilter.date.getUTCMinutes(), 0);
    assert.equal(capturedFilter.date.getUTCSeconds(), 0);
    assert.equal(capturedFilter.date.getUTCMilliseconds(), 0);
    assert.deepEqual(capturedUpdate, {
        productivity: 82,
        discipline: 75,
        date: capturedFilter.date
    });
    assert.deepEqual(capturedOptions, {
        upsert: true,
        new: true,
        runValidators: true
    });
});

test('getWeeklyStats uses a bounded lean query for dashboard data', async () => {
    const res = mockResponse();
    const calls = [];
    const weeklyStats = [
        { date: new Date('2026-05-21T00:00:00.000Z'), productivity: 70, discipline: 80 }
    ];

    replaceProperty(dailyStatsModel, 'find', (filter) => {
        calls.push(['find', filter]);
        return {
            sort(sortSpec) {
                calls.push(['sort', sortSpec]);
                return this;
            },
            select(projection) {
                calls.push(['select', projection]);
                return this;
            },
            async lean() {
                calls.push(['lean']);
                return weeklyStats;
            }
        };
    });

    await getWeeklyStats({
        body: { userId: '507f1f77bcf86cd799439011' },
        headers: {}
    }, res);

    assert.equal(res.body.success, true);
    assert.equal(res.body.data, weeklyStats);
    assert.equal(calls[0][0], 'find');
    assert.equal(calls[0][1].userId, '507f1f77bcf86cd799439011');
    assert.ok(calls[0][1].date.$gte instanceof Date);
    assert.equal(calls[0][1].date.$gte.getUTCHours(), 0);
    assert.deepEqual(calls.slice(1), [
        ['sort', { date: 1 }],
        ['select', 'date productivity discipline'],
        ['lean']
    ]);
});

test('authUser rejects requests without a token', async () => {
    const res = mockResponse();
    let nextCalled = false;

    await authUser({ headers: {}, body: {} }, res, () => {
        nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.deepEqual(res.body, {
        success: false,
        message: 'Not Authorized, Login Again'
    });
});

test('authUser stores decoded user id and calls next for a valid token', async () => {
    const previousSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'test-secret';
    const token = jwt.sign({ id: 'user-123' }, process.env.JWT_SECRET);
    const req = { headers: { token }, body: {} };
    let nextCalled = false;

    try {
        await authUser(req, mockResponse(), () => {
            nextCalled = true;
        });
    } finally {
        process.env.JWT_SECRET = previousSecret;
    }

    assert.equal(nextCalled, true);
    assert.equal(req.body.userId, 'user-123');
});

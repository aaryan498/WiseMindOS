import assert from 'node:assert/strict';
import test, { afterEach } from 'node:test';
import jwt from 'jsonwebtoken';

import { createGoal, getGoals, updateGoal } from '../controllers/goalController.js';
import { toggleTaskCompletion } from '../controllers/taskController.js';
import { loginUser, registerUser } from '../controllers/userController.js';
import authUser from '../middlewares/auth.js';
import dailyPlanModel from '../models/dailyPlanModel.js';
import { upload } from '../config/multer.js';
import goalModel from '../models/goalModel.js';
import notebookModel from '../models/notebookModel.js';
import pageModel from '../models/pageModel.js';
import taskModel from '../models/taskModel.js';
import userModel from '../models/userModel.js';


const originals = [];

function mockResponse() {
    return {
        body: undefined,
        statusCode: 200,
        status(code) {
            this.statusCode = code;
            return this;
        },
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

    await createGoal({ user: { id: 'user-1' }, body: { userId: 'user-1' } }, res, () => {});

    assert.deepEqual(res.body, {
        success: false,
        message: 'Title is required'
    });
});

test('createGoal rejects duplicate titles for the same user', async () => {
    const res = mockResponse();
    replaceProperty(goalModel, 'find', async () => [
        { title: 'Software Developer' }
    ]);

    await createGoal({
        user: { id: 'user-1' },
        body: {
            title: '  software developer '
        }
    }, res, () => {});

    assert.deepEqual(res.body, {
        success: false,
        message: 'A goal with this title already exists'
    });
});

test('createGoal persists default values for a valid goal', async () => {
    const res = mockResponse();
    replaceProperty(goalModel, 'find', async () => []);
    let savedGoal;
    replaceProperty(goalModel.prototype, 'save', async function save() {
        savedGoal = this;
        return this;
    });

    await createGoal({
        user: { id: '507f1f77bcf86cd799439011' },
        body: {
            title: 'Ship open-source work'
        }
    }, res, () => {});

    assert.equal(res.body.success, true);
    assert.equal(res.body.message, 'Goal Created Successfully !');
    assert.equal(savedGoal.title, 'Ship open-source work');
    assert.equal(savedGoal.type, 'personal');
    assert.equal(savedGoal.description, '');
    assert.equal(savedGoal.deadline, null);
});

test('getGoals calculates progress from completed goal tasks', async () => {
    const res = mockResponse();
    const goal = {
        _id: 'goal-1',
        toObject: () => ({ _id: 'goal-1', title: 'Testing coverage' })
    };

    replaceProperty(goalModel, 'find', async () => [goal]);
    replaceProperty(taskModel, 'find', async () => [
        { completed: true },
        { completed: false },
        { completed: true }
    ]);

    await getGoals({ user: { id: 'user-1' }, body: { userId: 'user-1' } }, res, () => {});

    assert.equal(res.body.success, true);
    assert.equal(res.body.goals[0].progress, 67);
});

test('updateGoal returns a validation response when goalId is missing', async () => {
    const res = mockResponse();

    await updateGoal({ body: {}, user: { id: 'user-1' } }, res, () => {});

    assert.deepEqual(res.body, {
        success: false,
        message: 'Goal ID is required'
    });
});

test('updateGoal returns a validation response when goal is not found', async () => {
    const res = mockResponse();
    replaceProperty(goalModel, 'findOne', async () => null);

    await updateGoal({
        body: { goalId: 'goal-99' },
        user: { id: 'user-1' }
    }, res, () => {});

    assert.deepEqual(res.body, {
        success: false,
        message: 'Goal not found'
    });
});

test('updateGoal rejects duplicate titles for the same user', async () => {
    const res = mockResponse();
    const existingGoal = {
        _id: 'goal-1',
        title: 'Original Title',
        save: async () => {}
    };
    replaceProperty(goalModel, 'findOne', async () => existingGoal);
    replaceProperty(goalModel, 'find', async () => [
        { _id: 'goal-2', title: 'duplicate title' }
    ]);

    await updateGoal({
        body: {
            goalId: 'goal-1',
            title: '  duplicate title '
        },
        user: { id: 'user-1' }
    }, res, () => {});

    assert.deepEqual(res.body, {
        success: false,
        message: 'A goal with this title already exists'
    });
});

test('updateGoal updates goal fields successfully', async () => {
    const res = mockResponse();
    const existingGoal = {
        _id: 'goal-1',
        title: 'Original Title',
        type: 'personal',
        saveCalled: false,
        async save() {
            this.saveCalled = true;
            return this;
        }
    };
    replaceProperty(goalModel, 'findOne', async () => existingGoal);
    replaceProperty(goalModel, 'find', async () => []);

    await updateGoal({
        body: {
            goalId: 'goal-1',
            title: 'Updated Title',
            type: 'professional'
        },
        user: { id: 'user-1' }
    }, res, () => {});

    assert.equal(res.body.success, true);
    assert.equal(res.body.message, 'Goal updated Successfully');
    assert.equal(existingGoal.title, 'Updated Title');
    assert.equal(existingGoal.type, 'professional');
    assert.equal(existingGoal.saveCalled, true);
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
    replaceProperty(userModel, 'findById', async () => ({ xp: 0, level: 1, save: async () => {} }));

    await toggleTaskCompletion({
        user: { id: 'user-1' },
        body: {
            taskId: 'task-1'
        }
    }, res, () => {});

    assert.equal(res.body.success, true);
    assert.equal(task.completed, true);
    assert.equal(task.saveCalled, true);
    assert.equal(plannedTask.completed, true);
    assert.equal(dailyPlan.saveCalled, true);
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
    const req = { headers: { authorization: `Bearer ${token}` }, body: {} };
    let nextCalled = false;

    try {
        await authUser(req, mockResponse(), () => {
            nextCalled = true;
        });
    } finally {
        process.env.JWT_SECRET = previousSecret;
    }

    assert.equal(nextCalled, true);
    assert.equal(req.user.id, 'user-123');
});

test('loginUser rejects object-type identifier (NoSQL injection attempt)', async () => {
    const res = mockResponse();

    await loginUser({
        body: { identifier: { $gt: '' }, password: { $gt: '' } }
    }, res, () => {});

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { success: false, message: 'Invalid input.' });
});

test('loginUser rejects array-type identifier', async () => {
    const res = mockResponse();

    await loginUser({
        body: { identifier: ['admin@example.com'], password: 'somepassword' }
    }, res, () => {});

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { success: false, message: 'Invalid input.' });
});

test('registerUser rejects object-type fields (NoSQL injection attempt)', async () => {
    const res = mockResponse();

    await registerUser({
        body: {
            name: { $gt: '' },
            email: { $gt: '' },
            password: { $gt: '' },
            username: { $gt: '' }
        }
    }, res, () => {});

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { success: false, message: 'Invalid input.' });
});

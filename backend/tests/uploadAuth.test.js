import assert from 'node:assert/strict';
import test from 'node:test';
import authUser from '../middlewares/auth.js';
import userRouter from '../routes/userRoute.js';

test('userRouter /profile-picture executes authUser before multer upload middleware', () => {
    const routeLayer = userRouter.stack.find(
        (layer) => layer.route && layer.route.path === '/profile-picture'
    );
    assert.ok(routeLayer, 'Route /profile-picture should exist on userRouter');

    const stack = routeLayer.route.stack;
    assert.ok(stack.length >= 2, 'Route should have multiple middleware handlers');
    assert.equal(stack[0].handle, authUser, 'First handler in pipeline must be authUser middleware');
});

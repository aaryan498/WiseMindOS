import assert from 'node:assert/strict';
import test, { beforeEach, afterEach } from 'node:test';
import errorHandler from '../middlewares/errorHandler.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

let originalEnv;
let loggedErrors = [];
let originalLoggerError;

function mockResponse() {
    return {
        statusCode: 200,
        body: undefined,
        headersSent: false,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        }
    };
}

beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
    loggedErrors = [];
    originalLoggerError = logger.error;
    logger.error = (msg, meta) => {
        loggedErrors.push({ msg, meta });
    };
});

afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    logger.error = originalLoggerError;
});

test('returns generic "Internal Server Error" for unexpected 500 errors in production', () => {
    process.env.NODE_ENV = 'production';

    const req = { originalUrl: '/api/tasks', method: 'GET', ip: '127.0.0.1' };
    const res = mockResponse();
    let nextCalled = false;

    const unexpectedError = new Error('MongoNetworkError: failed to connect to server [cluster0.mongodb.net:27017]');

    errorHandler(unexpectedError, req, res, () => { nextCalled = true; });

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.body, {
        success: false,
        message: 'Internal Server Error'
    });
    assert.equal(nextCalled, false);
    assert.equal(loggedErrors.length, 1);
    assert.match(loggedErrors[0].msg, /MongoNetworkError/);
    assert.equal(loggedErrors[0].meta.statusCode, 500);
});

test('returns detailed error message and stack for 500 errors in development', () => {
    process.env.NODE_ENV = 'development';

    const req = { originalUrl: '/api/tasks', method: 'GET', ip: '127.0.0.1' };
    const res = mockResponse();

    const unexpectedError = new Error('Database connection failed');

    errorHandler(unexpectedError, req, res, () => {});

    assert.equal(res.statusCode, 500);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, 'Database connection failed');
    assert.ok(res.body.stack);
});

test('returns explicit operational message and status code for 4xx client errors in production', () => {
    process.env.NODE_ENV = 'production';

    const req = { originalUrl: '/api/goals', method: 'POST', ip: '127.0.0.1' };
    const res = mockResponse();

    const clientError = new AppError('Title is required', 400);

    errorHandler(clientError, req, res, () => {});

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
        success: false,
        message: 'Title is required'
    });
});

test('handles Mongoose CastError by converting to 400 Bad Request', () => {
    process.env.NODE_ENV = 'production';

    const req = { originalUrl: '/api/tasks/123', method: 'GET', ip: '127.0.0.1' };
    const res = mockResponse();

    const castError = new Error('Cast to ObjectId failed for value "123" at path "_id"');
    castError.name = 'CastError';
    castError.path = '_id';
    castError.value = '123';

    errorHandler(castError, req, res, () => {});

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
        success: false,
        message: 'Invalid _id: 123'
    });
});

test('handles Mongoose ValidationError by converting to 400 Bad Request', () => {
    process.env.NODE_ENV = 'production';

    const req = { originalUrl: '/api/users', method: 'POST', ip: '127.0.0.1' };
    const res = mockResponse();

    const validationError = new Error('Validation failed');
    validationError.name = 'ValidationError';
    validationError.errors = {
        email: { message: 'Please provide a valid email' },
        password: { message: 'Password must be at least 6 characters' }
    };

    errorHandler(validationError, req, res, () => {});

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
        success: false,
        message: 'Please provide a valid email, Password must be at least 6 characters'
    });
});

test('handles MongoDB duplicate key error code 11000', () => {
    process.env.NODE_ENV = 'production';

    const req = { originalUrl: '/api/user/register', method: 'POST', ip: '127.0.0.1' };
    const res = mockResponse();

    const duplicateError = new Error('E11000 duplicate key error collection: users index: email_1 dup key');
    duplicateError.code = 11000;

    errorHandler(duplicateError, req, res, () => {});

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
        success: false,
        message: 'Duplicate field value entered'
    });
});

test('handles JWT errors with 401 status', () => {
    process.env.NODE_ENV = 'production';

    const req = { originalUrl: '/api/tasks', method: 'GET', ip: '127.0.0.1' };
    const res = mockResponse();

    const jwtError = new Error('invalid signature');
    jwtError.name = 'JsonWebTokenError';

    errorHandler(jwtError, req, res, () => {});

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, {
        success: false,
        message: 'Invalid token, please login again'
    });
});

test('delegates to next(err) if headers have already been sent', () => {
    const req = { originalUrl: '/api/tasks', method: 'GET', ip: '127.0.0.1' };
    const res = mockResponse();
    res.headersSent = true;
    let nextError = null;

    const error = new Error('Some error');
    errorHandler(error, req, res, (err) => {
        nextError = err;
    });

    assert.equal(nextError, error);
    assert.equal(res.body, undefined);
});

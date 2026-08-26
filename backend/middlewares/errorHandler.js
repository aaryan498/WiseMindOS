import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    // Log full error details server-side including stack trace
    logger.error(`${err.message || 'Internal Server Error'} - ${req.originalUrl || ''} - ${req.method || ''} - ${req.ip || ''}`, {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        statusCode: err.statusCode || 500,
    });

    // Check if headers have already been sent to avoid duplicate responses
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
    let message = err.message || 'Internal Server Error';
    let isOperational = Boolean(err.isOperational);

    // Handle known library/framework operational errors
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path || 'field'}: ${err.value}`;
        isOperational = true;
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.errors ? Object.values(err.errors).map(val => val.message).join(', ') : err.message;
        isOperational = true;
    } else if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
        isOperational = true;
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token, please login again';
        isOperational = true;
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired, please login again';
        isOperational = true;
    } else if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400 && 'body' in err)) {
        statusCode = 400;
        message = 'Invalid JSON in request body';
        isOperational = true;
    }

    const isClientError = statusCode >= 400 && statusCode < 500;
    const isDev = process.env.NODE_ENV === 'development';

    // Differentiate between expected/operational errors and unexpected server errors:
    // Operational/client errors (4xx) return their specific message.
    // Unexpected server errors (5xx) return a generic message in production to prevent information disclosure.
    const clientMessage = (isClientError || isOperational || isDev)
        ? message
        : 'Internal Server Error';

    const response = {
        success: false,
        message: clientMessage
    };

    // In development mode, provide additional debugging info for 5xx errors
    if (isDev && statusCode >= 500) {
        if (err.stack) {
            response.stack = err.stack;
        }
        if (err.message && clientMessage !== err.message) {
            response.error = err.message;
        }
    }

    res.status(statusCode).json(response);
};

export default errorHandler;

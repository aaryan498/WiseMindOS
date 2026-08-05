import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    
    // Check if headers have already been sent to avoid duplicate responses
    if (res.headersSent) {
        return next(err);
    }

    // Malformed ObjectIds throw a Mongoose CastError whose default message
    // exposes internal field/model names; respond generically instead.
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

export default errorHandler;

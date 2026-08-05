import mongoose from 'mongoose';

// Validates that req.body[fieldName] is a syntactically valid Mongo ObjectId
// before it reaches a Mongoose query, so malformed values return 400 instead
// of an unhandled CastError (500 with leaked schema/model details).
const validateObjectId = (fieldName) => (req, res, next) => {
    const value = req.body[fieldName];

    if (value !== undefined && !mongoose.Types.ObjectId.isValid(value)) {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    next();
};

export default validateObjectId;

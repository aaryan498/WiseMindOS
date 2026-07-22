import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, default: '' }
}, { _id: false });

const metricsSummarySchema = new mongoose.Schema({
    habitsCompleted:    { type: Number, default: 0 },
    totalHabits:        { type: Number, default: 0 },
    tasksCompleted:     { type: Number, default: 0 },
    totalTasks:         { type: Number, default: 0 },
    avgProductivity:    { type: Number, default: 0 },
    avgDiscipline:      { type: Number, default: 0 },
    focusSessionsCount: { type: Number, default: 0 },
    goalsCount:         { type: Number, default: 0 }
}, { _id: false });

const retrospectiveSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    weekStartDate: { type: Date, required: true },
    weekEndDate:   { type: Date, required: true },

    metricsSummary: { type: metricsSummarySchema, default: () => ({}) },

    responses: { type: [responseSchema], default: [] },

    overallRating: { type: Number, min: 1, max: 10, default: 5 },

    // Reference to the Library page where this is archived
    libraryNotebookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notebook',
        default: null
    },
    libraryPageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'page',
        default: null
    },

    createdAt: { type: Date, default: Date.now }
}, { minimize: false });

// One retrospective per week per user
retrospectiveSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });

const retrospectiveModel =
    mongoose.models.retrospective ||
    mongoose.model('retrospective', retrospectiveSchema);

export default retrospectiveModel;

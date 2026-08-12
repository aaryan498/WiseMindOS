import mongoose from 'mongoose';

const plannedTaskSchema = new mongoose.Schema({
    source: { type: String, enum: ['task', 'habit', 'manual'], required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'task', default: null },
    habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'habit', default: null },
    title: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    isImportant: { type: Boolean, default: false },
    notes: { type: String, default: '' },
    color: { type: String, default: '' }
}, { _id: true });

const dailyPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD format
    plannedTasks: [plannedTaskSchema]
}, { minimize: false });

// CRITICAL: Ensure one document per user per day
dailyPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

const dailyPlanModel = mongoose.models.dailyPlan || mongoose.model('dailyPlan', dailyPlanSchema);

export default dailyPlanModel;
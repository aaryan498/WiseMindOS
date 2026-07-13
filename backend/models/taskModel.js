import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'goal', default: null },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'project', default: null },
    isImportant: { type: Boolean, default: false },
    deadline: { type: Date },
    createdFrom: { type: String, default: 'manual' },
    createdAt: { type: Date, default: Date.now }
}, { minimize: false });

taskSchema.index({ userId: 1 });
taskSchema.index({ goalId: 1 });
taskSchema.index({ projectId: 1 });
taskSchema.index({ userId: 1, goalId: 1 });
taskSchema.index({ userId: 1, projectId: 1 });

const taskModel = mongoose.models.task || mongoose.model('task', taskSchema);

export default taskModel;
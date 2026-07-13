import mongoose from 'mongoose';
import goalModel from '../models/goalModel.js';
import projectModel from '../models/projectModel.js';
import taskModel from '../models/taskModel.js';
import { sanitizeField } from '../utils/sanitize.js';

const normalizeGoalTitle = (title) => (title ?? '').trim().toLowerCase();
// Create Goal
const createGoal = async (req, res, next) => {
    try {
        const { title, type, description, deadline } = req.body;
        const userId = req.user.id;

       const { value: cleanTitle, error: titleError } = sanitizeField(title, 'title', { required: true });
        if (titleError) return res.json({ success: false, message: titleError });

        const { value: cleanDescription } = sanitizeField(description, 'description');
        const trimmedTitle = cleanTitle;
        const existingGoals = await goalModel.find({ userId });
        const isDuplicate = existingGoals.some(
            (goal) => normalizeGoalTitle(goal.title) === normalizeGoalTitle(trimmedTitle)
        );

        if (isDuplicate) {
            return res.json({ success: false, message: 'A goal with this title already exists' });
        }

       const newGoal = new goalModel({
            userId,
            title: trimmedTitle,
            type: type || 'personal',
            description: cleanDescription || '',
            deadline: deadline || null
        });

        await newGoal.save();
        res.json({ success: true, goal: newGoal, message: 'Goal Created Successfully !' });

    } catch (error) {
        next(error);
    }
};

// Get All Goals
const getGoals = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const goals = await goalModel.find({ userId });

        // Single aggregation to get task counts for all goals
        const goalProgress = await taskModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), goalId: { $ne: null } } },
            { $group: { _id: "$goalId", total: { $sum: 1 }, completed: { $sum: { $cond: ["$completed", 1, 0] } } } }
        ]);

        const progressMap = {};
        goalProgress.forEach(item => {
            progressMap[item._id.toString()] = {
                total: item.total,
                completed: item.completed,
                progress: item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0
            };
        });

        const goalsWithProgress = goals.map(goal => {
            const data = progressMap[goal._id.toString()] || { total: 0, completed: 0, progress: 0 };
            return { ...goal.toObject(), progress: data.progress };
        });

        res.json({ success: true, goals: goalsWithProgress });

    } catch (error) {
        next(error);
    }
};

// Update Goal
const updateGoal = async (req, res, next) => {
    try {
        const { goalId, title, type, description, deadline } = req.body;
        const userId = req.user.id;

        if (!goalId) {
            return res.json({ success: false, message: 'Goal ID is required' });
        }

        const goal = await goalModel.findOne({ _id: goalId, userId });
        if (!goal) {
            return res.json({ success: false, message: 'Goal not found' });
        }

        if (title) {
            const trimmedTitle = title.trim();
            if (!trimmedTitle) {
                return res.json({ success: false, message: 'Title is required' });
            }
            const existingGoals = await goalModel.find({ userId, _id: { $ne: goalId } });
            const isDuplicate = existingGoals.some(
                (g) => normalizeGoalTitle(g.title) === normalizeGoalTitle(trimmedTitle)
            );
            if (isDuplicate) {
                return res.json({ success: false, message: 'A goal with this title already exists' });
            }
            goal.title = trimmedTitle;
        }
        if (type) goal.type = type;
        if (description !== undefined) goal.description = description;
        if (deadline !== undefined) goal.deadline = deadline;

        await goal.save();
        res.json({ success: true, goal, message: 'Goal updated Successfully' });

    } catch (error) {
        next(error);
    }
};

// Delete Goal
const deleteGoal = async (req, res, next) => {
    try {
        const { goalId } = req.body;
        const userId = req.user.id;

        if (!goalId) {
            return res.json({ success: false, message: 'Goal ID is required' });
        }

        const goal = await goalModel.findOneAndDelete({ _id: goalId, userId });
        if (!goal) {
            return res.json({ success: false, message: 'Goal not found' });
        }

        await Promise.all([
            projectModel.updateMany({ userId, goalId }, { $set: { goalId: null } }),
            taskModel.updateMany({ userId, goalId }, { $set: { goalId: null } }),
        ]);

        res.json({ success: true, message: 'Goal deleted successfully' });

    } catch (error) {
        next(error);
    }
};

export { createGoal, getGoals, updateGoal, deleteGoal };
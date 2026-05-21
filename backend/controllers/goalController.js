import goalModel from '../models/goalModel.js';
import taskModel from '../models/taskModel.js';
import { emptyProgressSummary, summarizeTaskProgress } from '../utils/progressSummary.js';

// Create Goal
const createGoal = async (req, res) => {
    try {
        const { title, type, description, deadline } = req.body;
        const userId = req.body.userId;

        if (!title) {
            return res.json({ success: false, message: 'Title is required' });
        }

        const newGoal = new goalModel({
            userId,
            title,
            type: type || 'personal',
            description: description || '',
            deadline: deadline || null
        });

        await newGoal.save();
        res.json({ success: true, goal: newGoal, message: 'Goal Created Successfully !' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get All Goals
const getGoals = async (req, res) => {
    try {
        const userId = req.body.userId;
        const goals = await goalModel.find({ userId }).lean();
        const goalIds = goals.map(goal => goal._id);

        const goalTasks = goalIds.length > 0
            ? await taskModel.find(
                { userId, goalId: { $in: goalIds } },
                { goalId: 1, completed: 1 }
            ).lean()
            : [];

        const progressByGoalId = summarizeTaskProgress(goalTasks, 'goalId');

        const goalsWithProgress = goals.map((goal) => {
            const summary = progressByGoalId.get(goal._id.toString()) || emptyProgressSummary;
            return {
                ...goal,
                progress: summary.progress
            };
        });

        res.json({ success: true, goals: goalsWithProgress });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update Goal
const updateGoal = async (req, res) => {
    try {
        const { goalId, title, type, description, deadline } = req.body;
        const userId = req.body.userId;

        if (!goalId) {
            return res.json({ success: false, message: 'Goal ID is required' });
        }

        const goal = await goalModel.findOne({ _id: goalId, userId });
        if (!goal) {
            return res.json({ success: false, message: 'Goal not found' });
        }

        if (title) goal.title = title;
        if (type) goal.type = type;
        if (description !== undefined) goal.description = description;
        if (deadline !== undefined) goal.deadline = deadline;

        await goal.save();
        res.json({ success: true, goal, message: 'Goal updated Successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete Goal
const deleteGoal = async (req, res) => {
    try {
        const { goalId } = req.body;
        const userId = req.body.userId;

        if (!goalId) {
            return res.json({ success: false, message: 'Goal ID is required' });
        }

        const goal = await goalModel.findOneAndDelete({ _id: goalId, userId });
        if (!goal) {
            return res.json({ success: false, message: 'Goal not found' });
        }

        res.json({ success: true, message: 'Goal deleted successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { createGoal, getGoals, updateGoal, deleteGoal };

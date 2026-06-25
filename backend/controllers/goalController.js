import goalModel from '../models/goalModel.js';
import taskModel from '../models/taskModel.js';

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
        const page = Number(req.body?.page || req.query?.page) || 1;
        let limit = Number(req.body?.limit || req.query?.limit) || 20;

        // Enforce maximum page size limits
        const maxLimit = 100;
        if (limit > maxLimit) limit = maxLimit;
        if (limit < 1) limit = 20;

        const skip = (page - 1) * limit;

        // Sorting support (default sorting by createdAt desc)
        const sortBy = req.body?.sortBy || req.query?.sortBy || 'createdAt';
        const sortOrder = req.body?.sortOrder || req.query?.sortOrder || 'desc';
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const total = await goalModel.countDocuments({ userId });
        const goals = await goalModel.find({ userId })
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        // Calculate progress dynamically for each goal
        const goalsWithProgress = await Promise.all(goals.map(async (goal) => {
            const goalTasks = await taskModel.find({ userId, goalId: goal._id });
            const completedTasks = goalTasks.filter(task => task.completed).length;
            const progress = goalTasks.length > 0 ? Math.round((completedTasks / goalTasks.length) * 100) : 0;

            return {
                ...goal.toObject(),
                progress
            };
        }));

        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: goalsWithProgress,
            goals: goalsWithProgress, // Backward compatibility
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });

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
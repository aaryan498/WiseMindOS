import taskModel from '../models/taskModel.js';
import dailyPlanModel from '../models/dailyPlanModel.js';

// Create Task
const createTask = async (req, res) => {
    try {
        const { title, goalId, projectId, isImportant, deadline, createdFrom } = req.body;
        const userId = req.body.userId;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }

        const newTask = new taskModel({
            userId,
            title,
            completed: false,
            goalId: goalId || null,
            projectId: projectId || null,
            isImportant: isImportant || false,
            deadline: deadline || null,
            createdFrom: createdFrom || 'manual'
        });

        await newTask.save();
        res.json({ success: true, task: newTask, message: 'Task Created Successfully !' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Tasks
const getTasks = async (req, res) => {
    try {
        const userId = req.body.userId;
        const tasks = await taskModel.find({ userId });
        res.json({ success: true, tasks });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Task
const updateTask = async (req, res) => {
    try {
        const { taskId, title, goalId, projectId, isImportant, deadline, completed } = req.body;
        const userId = req.body.userId;

        if (!taskId) {
            return res.status(400).json({ success: false, message: 'Task ID is required' });
        }

        const task = await taskModel.findOne({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        if (title) task.title = title;
        if (goalId !== undefined) task.goalId = goalId;
        if (projectId !== undefined) task.projectId = projectId;
        if (isImportant !== undefined) task.isImportant = isImportant;
        if (deadline !== undefined) task.deadline = deadline;
        if (completed !== undefined) task.completed = completed;

        await task.save();
        res.json({ success: true, task, message: 'Task Updated !' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle Task Completion (SSOT - Updates Task first, then DailyPlan)
const toggleTaskCompletion = async (req, res) => {
    try {
        const { taskId } = req.body;
        const userId = req.body.userId;

        if (!taskId) {
            return res.status(400).json({ success: false, message: 'Task ID is required' });
        }

        // SOURCE OF TRUTH: Update Task first
        const task = await taskModel.findOne({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        task.completed = !task.completed;
        await task.save();

        // SYNC: Update in DailyPlan if exists
        const today = new Date().toISOString().split('T')[0];
        const dailyPlan = await dailyPlanModel.findOne({ userId, date: today });
        
        if (dailyPlan) {
            const plannedTask = dailyPlan.plannedTasks.find(pt => 
                pt.source === 'task' && pt.taskId && pt.taskId.toString() === taskId
            );
            
            if (plannedTask) {
                plannedTask.completed = task.completed;
                await dailyPlan.save();
            }
        }

        res.json({ success: true, task });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.body;
        const userId = req.body.userId;

        if (!taskId) {
            return res.status(400).json({ success: false, message: 'Task ID is required' });
        }

        const task = await taskModel.findOneAndDelete({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Remove from DailyPlan if exists
        await dailyPlanModel.updateMany(
            { userId },
            { $pull: { plannedTasks: { taskId: taskId } } }
        );

        res.json({ success: true, message: 'Task deleted successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { createTask, getTasks, updateTask, toggleTaskCompletion, deleteTask };
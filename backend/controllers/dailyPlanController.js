import dailyPlanModel from '../models/dailyPlanModel.js';
import taskModel from '../models/taskModel.js';
import habitModel from '../models/habitModel.js';

// Helper function for streak logic
const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const compareDate = new Date(date);
    return yesterday.toISOString().split('T')[0] === compareDate.toISOString().split('T')[0];
};

const isToday = (date) => {
    const today = new Date().toISOString().split('T')[0];
    const compareDate = new Date(date).toISOString().split('T')[0];
    return today === compareDate;
};

// Get Today's Daily Plan (or create if not exists)
const getTodayPlan = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        let dailyPlan = await dailyPlanModel.findOne({ userId, date: today });

        // Create if doesn't exist
        if (!dailyPlan) {
            dailyPlan = new dailyPlanModel({
                userId,
                date: today,
                plannedTasks: []
            });
            await dailyPlan.save();
        }

        res.json({ success: true, dailyPlan });

    } catch (error) {
        next(error);
    }
};

// Add Task to Daily Plan
const addToDailyPlan = async (req, res, next) => {
    try {
        const { source, taskId, habitId, title, startTime, endTime, isImportant } = req.body;
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        if (!source || !title || !startTime || !endTime) {
            return res.json({ success: false, message: 'Missing required fields' });
        }

        if (!['task', 'habit', 'manual'].includes(source)) {
            return res.json({ success: false, message: 'Invalid source type' });
        }

        // Validation based on source
        if (source === 'task' && !taskId) {
            return res.json({ success: false, message: 'taskId required for task source' });
        }
        if (source === 'habit' && !habitId) {
            return res.json({ success: false, message: 'habitId required for habit source' });
        }

        // Validate that the source record exists
        if (source === 'task' && taskId) {
            const task = await taskModel.findOne({ _id: taskId, userId });
            if (!task) {
                return res.json({ success: false, message: 'Task not found' });
            }
        }
        if (source === 'habit' && habitId) {
            const habit = await habitModel.findOne({ _id: habitId, userId });
            if (!habit) {
                return res.json({ success: false, message: 'Habit not found' });
            }
        }

        // Get or create today's plan
        let dailyPlan = await dailyPlanModel.findOne({ userId, date: today });
        if (!dailyPlan) {
            dailyPlan = new dailyPlanModel({ userId, date: today, plannedTasks: [] });
        }

        // Check if already exists (prevent duplicates)
        const alreadyExists = dailyPlan.plannedTasks.some(pt => {
            if (source === 'task' && pt.taskId) {
                return pt.taskId.toString() === taskId;
            }
            if (source === 'habit' && pt.habitId) {
                return pt.habitId.toString() === habitId;
            }
            return false;
        });

        if (alreadyExists) {
            return res.json({ success: false, message: 'Already added to daily plan' });
        }

        // Fetch completion status from source if applicable
        let completed = false;
        if (source === 'task' && taskId) {
            const task = await taskModel.findOne({ _id: taskId, userId });
            if (task) completed = task.completed;
        }
        if (source === 'habit' && habitId) {
            const habit = await habitModel.findOne({ _id: habitId, userId });
            if (habit && habit.lastCompleted && isToday(habit.lastCompleted)) {
                completed = true;
            }
        }

        // Add to plan
        const newPlannedTask = {
            source,
            taskId: taskId || null,
            habitId: habitId || null,
            title,
            startTime,
            endTime,
            completed,
            isImportant: isImportant || false
        };

        dailyPlan.plannedTasks.push(newPlannedTask);
        await dailyPlan.save();

        res.json({ success: true, dailyPlan, message: 'Task added for today' });

    } catch (error) {
        next(error);
    }
};

// Remove from Daily Plan
const removeFromDailyPlan = async (req, res, next) => {
    try {
        const { plannedTaskId } = req.body;
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        if (!plannedTaskId) {
            return res.json({ success: false, message: 'Planned task ID is required' });
        }

        const dailyPlan = await dailyPlanModel.findOne({ userId, date: today });
        if (!dailyPlan) {
            return res.json({ success: false, message: 'Daily plan not found' });
        }

        const existingTask = dailyPlan.plannedTasks.id(plannedTaskId);
        if (!existingTask) {
            return res.json({ success: false, message: 'Planned task not found' });
        }

        dailyPlan.plannedTasks = dailyPlan.plannedTasks.filter(
            pt => pt._id.toString() !== plannedTaskId
        );

        await dailyPlan.save();
        res.json({ success: true, dailyPlan, message: 'Task removed successfully !' });

    } catch (error) {
        next(error);
    }
};

// Toggle Daily Plan Task Completion (CRITICAL - Updates source first, then reflects)
const toggleDailyPlanTask = async (req, res, next) => {
    try {
        const { plannedTaskId } = req.body;
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        if (!plannedTaskId) {
            return res.json({ success: false, message: 'Planned task ID is required' });
        }

        const dailyPlan = await dailyPlanModel.findOne({ userId, date: today });
        if (!dailyPlan) {
            return res.json({ success: false, message: 'Daily plan not found' });
        }

        const plannedTask = dailyPlan.plannedTasks.id(plannedTaskId);
        if (!plannedTask) {
            return res.json({ success: false, message: 'Planned task not found' });
        }

        // SSOT: Update source first, then reflect in DailyPlan
        if (plannedTask.source === 'task' && plannedTask.taskId) {
            const task = await taskModel.findOne({ _id: plannedTask.taskId, userId });
            if (task) {
                task.completed = !task.completed;
                await task.save();
                plannedTask.completed = task.completed;
                plannedTask.completedAt = task.completed ? new Date() : null;
            }
        } else if (plannedTask.source === 'habit' && plannedTask.habitId) {
            const habit = await habitModel.findOne({ _id: plannedTask.habitId, userId });
            if (habit) {

                if (habit.lastCompleted && isToday(habit.lastCompleted)) {
                    // UNTOGGLE (VERY IMPORTANT FIX)

                    plannedTask.completed = false;
                    plannedTask.completedAt = null;

                    // rollback streak
                    habit.streak = habit.streak > 0 ? habit.streak - 1 : 0;

                    // fix lastCompleted
                    if (habit.streak === 0) {
                        habit.lastCompleted = null;
                    } else {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        habit.lastCompleted = yesterday;
                    }

                    await habit.save();

                } else {
                    // COMPLETE habit

                    if (habit.lastCompleted && isYesterday(habit.lastCompleted)) {
                        habit.streak += 1;
                    } else {
                        habit.streak = 1;
                    }

                    habit.lastCompleted = new Date();
                    await habit.save();

                    plannedTask.completed = true;
                    plannedTask.completedAt = new Date();
                }
            }
        } else if (plannedTask.source === 'manual') {
            // Manual tasks: only toggle in DailyPlan
            plannedTask.completed = !plannedTask.completed;
            plannedTask.completedAt = plannedTask.completed ? new Date() : null;
        }

        await dailyPlan.save();
        res.json({ success: true, dailyPlan });

    } catch (error) {
        next(error);
    }
};

// Clear Daily Plan
const clearDailyPlan = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        const dailyPlan = await dailyPlanModel.findOne({ userId, date: today });
        if (!dailyPlan) {
            return res.json({ success: false, message: 'Daily plan not found' });
        }

        dailyPlan.plannedTasks = [];
        await dailyPlan.save();

        res.json({ success: true, dailyPlan });

    } catch (error) {
        next(error);
    }
};

export { getTodayPlan, addToDailyPlan, removeFromDailyPlan, toggleDailyPlanTask, clearDailyPlan };
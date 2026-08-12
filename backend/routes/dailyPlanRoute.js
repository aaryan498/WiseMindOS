import express from 'express';
import {
    getTodayPlan,
    addToDailyPlan,
    removeFromDailyPlan,
    toggleDailyPlanTask,
    clearDailyPlan,
    updateDailyPlanTask
} from '../controllers/dailyPlanController.js';
import authUser from '../middlewares/auth.js';

const dailyPlanRouter = express.Router();

dailyPlanRouter.get('/today', authUser, getTodayPlan);
dailyPlanRouter.post('/tasks', authUser, addToDailyPlan);
dailyPlanRouter.patch('/tasks/:plannedTaskId/toggle', authUser, toggleDailyPlanTask);
dailyPlanRouter.delete('/tasks/:plannedTaskId', authUser, removeFromDailyPlan);
dailyPlanRouter.patch('/tasks/:plannedTaskId', authUser, updateDailyPlanTask);
dailyPlanRouter.delete('/', authUser, clearDailyPlan);

export default dailyPlanRouter;
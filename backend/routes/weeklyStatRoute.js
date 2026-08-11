import express from 'express';
import { saveDailyStats, getWeeklyStats } from '../controllers/statsController.js';
import authUser from '../middlewares/auth.js';

const weeklyStatRouter = express.Router();

weeklyStatRouter.post('/', authUser, saveDailyStats);
weeklyStatRouter.get('/weekly', authUser, getWeeklyStats);

export default weeklyStatRouter;
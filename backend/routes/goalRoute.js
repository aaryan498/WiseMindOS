import express from 'express';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../controllers/goalController.js';
import authUser from '../middlewares/auth.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const goalRouter = express.Router();

goalRouter.post('/create', authUser, createGoal);
goalRouter.post('/list', authUser, getGoals);
goalRouter.post('/update', authUser, validateObjectId('goalId'), updateGoal);
goalRouter.post('/delete', authUser, validateObjectId('goalId'), deleteGoal);

export default goalRouter;
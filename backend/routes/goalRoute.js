import express from 'express';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../controllers/goalController.js';
import authUser from '../middlewares/auth.js';

const goalRouter = express.Router();

goalRouter.get('/', authUser, getGoals);
goalRouter.post('/', authUser, createGoal);
goalRouter.patch('/:goalId', authUser, updateGoal);
goalRouter.delete('/:goalId', authUser, deleteGoal);

export default goalRouter;
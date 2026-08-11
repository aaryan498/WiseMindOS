import express from 'express';
import {
    createHabit,
    getHabits,
    updateHabit,
    completeHabit,
    deleteHabit
} from '../controllers/habitController.js';
import authUser from '../middlewares/auth.js';

const habitRouter = express.Router();

habitRouter.get('/', authUser, getHabits);
habitRouter.post('/', authUser, createHabit);
habitRouter.patch('/:habitId', authUser, updateHabit);
habitRouter.patch('/:habitId/complete', authUser, completeHabit);
habitRouter.delete('/:habitId', authUser, deleteHabit);

export default habitRouter;
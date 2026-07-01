import express from 'express';
import { createHabit, getHabits, updateHabit, completeHabit, deleteHabit } from '../controllers/habitController.js';
import authUser from '../middlewares/auth.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const habitRouter = express.Router();

habitRouter.post('/create', authUser, createHabit);
habitRouter.post('/list', authUser, getHabits);
habitRouter.post('/update', authUser, validateObjectId('habitId'), updateHabit);
habitRouter.post('/complete', authUser, validateObjectId('habitId'), completeHabit);
habitRouter.post('/delete', authUser, validateObjectId('habitId'), deleteHabit);

export default habitRouter;
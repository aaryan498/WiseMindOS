import express from 'express';
import { createTask, getTasks, updateTask, toggleTaskCompletion, deleteTask } from '../controllers/taskController.js';
import authUser from '../middlewares/auth.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const taskRouter = express.Router();

taskRouter.post('/create', authUser, createTask);
taskRouter.post('/list', authUser, getTasks);
taskRouter.post('/update', authUser, validateObjectId('taskId'), updateTask);
taskRouter.post('/toggle', authUser, validateObjectId('taskId'), toggleTaskCompletion);
taskRouter.post('/delete', authUser, validateObjectId('taskId'), deleteTask);

export default taskRouter;
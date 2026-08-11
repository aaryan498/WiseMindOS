import express from 'express';
import {
    createTask,
    getTasks,
    updateTask,
    toggleTaskCompletion,
    deleteTask
} from '../controllers/taskController.js';
import authUser from '../middlewares/auth.js';

const taskRouter = express.Router();

taskRouter.get('/', authUser, getTasks);
taskRouter.post('/', authUser, createTask);
taskRouter.patch('/:taskId', authUser, updateTask);
taskRouter.patch('/:taskId/toggle', authUser, toggleTaskCompletion);
taskRouter.delete('/:taskId', authUser, deleteTask);

export default taskRouter;
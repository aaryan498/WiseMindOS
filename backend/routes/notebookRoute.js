import express from 'express';
import { createNotebook, getNotebooks, deleteNotebook, updateNotebook } from '../controllers/notebookController.js';
import authUser from '../middlewares/auth.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const notebookRouter = express.Router();

notebookRouter.post('/create', authUser, createNotebook);
notebookRouter.post('/list', authUser, getNotebooks);
notebookRouter.post('/update', authUser, validateObjectId('notebookId'), updateNotebook);
notebookRouter.post('/delete', authUser, validateObjectId('notebookId'), deleteNotebook);

export default notebookRouter;
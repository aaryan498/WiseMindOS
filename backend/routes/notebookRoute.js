import express from 'express';
import {
    createNotebook,
    getNotebooks,
    deleteNotebook,
    updateNotebook
} from '../controllers/notebookController.js';
import authUser from '../middlewares/auth.js';

const notebookRouter = express.Router();

notebookRouter.get('/', authUser, getNotebooks);
notebookRouter.post('/', authUser, createNotebook);
notebookRouter.patch('/:notebookId', authUser, updateNotebook);
notebookRouter.delete('/:notebookId', authUser, deleteNotebook);

export default notebookRouter;
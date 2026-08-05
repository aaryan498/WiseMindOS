import express from 'express';
import { createPage, getPages, updatePage, deletePage } from '../controllers/pageController.js';
import authUser from '../middlewares/auth.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const pageRouter = express.Router();

pageRouter.post('/create', authUser, validateObjectId('notebookId'), createPage);
pageRouter.post('/list', authUser, validateObjectId('notebookId'), getPages);
pageRouter.post('/update', authUser, validateObjectId('pageId'), updatePage);
pageRouter.post('/delete', authUser, validateObjectId('pageId'), validateObjectId('notebookId'), deletePage);

export default pageRouter;
import express from 'express';
import {
    createPage,
    getPages,
    updatePage,
    deletePage
} from '../controllers/pageController.js';
import authUser from '../middlewares/auth.js';

const pageRouter = express.Router();

pageRouter.get('/', authUser, getPages);
pageRouter.post('/', authUser, createPage);
pageRouter.patch('/:pageId', authUser, updatePage);
pageRouter.delete('/:pageId', authUser, deletePage);

export default pageRouter;
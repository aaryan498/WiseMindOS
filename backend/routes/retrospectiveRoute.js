import express from 'express';
import {
    createRetrospective,
    getRetrospectives,
    deleteRetrospective
} from '../controllers/retrospectiveController.js';
import authUser from '../middlewares/auth.js';

const retrospectiveRouter = express.Router();

retrospectiveRouter.post('/create', authUser, createRetrospective);
retrospectiveRouter.post('/list',   authUser, getRetrospectives);
retrospectiveRouter.post('/delete', authUser, deleteRetrospective);

export default retrospectiveRouter;

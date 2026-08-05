import express from 'express';
import { createProject, getProjects, updateProject, deleteProject } from '../controllers/projectController.js';
import authUser from '../middlewares/auth.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const projectRouter = express.Router();

projectRouter.post('/create', authUser, createProject);
projectRouter.post('/list', authUser, getProjects);
projectRouter.post('/update', authUser, validateObjectId('projectId'), updateProject);
projectRouter.post('/delete', authUser, validateObjectId('projectId'), deleteProject);

export default projectRouter;
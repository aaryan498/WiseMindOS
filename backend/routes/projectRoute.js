import express from 'express';
import { createProject, getProjects, updateProject, deleteProject } from '../controllers/projectController.js';
import authUser from '../middlewares/auth.js';

const projectRouter = express.Router();

projectRouter.get('/', authUser, getProjects);
projectRouter.post('/', authUser, createProject);
projectRouter.patch('/:projectId', authUser, updateProject);
projectRouter.delete('/:projectId', authUser, deleteProject);

export default projectRouter;
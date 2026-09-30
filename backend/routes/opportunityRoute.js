import express from 'express';
import {
  createOpportunity,
  getOpportunities,
  updateOpportunity,
  updateSkillProgress,
  deleteOpportunity
} from '../controllers/opportunityController.js';
import authUser from '../middlewares/auth.js';

const opportunityRouter = express.Router();

opportunityRouter.post('/create', authUser, createOpportunity);
opportunityRouter.get('/', authUser, getOpportunities);
opportunityRouter.post('/list', authUser, getOpportunities);
opportunityRouter.put('/:id', authUser, updateOpportunity);
opportunityRouter.post('/update', authUser, updateOpportunity);
opportunityRouter.patch('/:id/skills/:skillId', authUser, updateSkillProgress);
opportunityRouter.delete('/:id', authUser, deleteOpportunity);
opportunityRouter.post('/delete', authUser, deleteOpportunity);

export default opportunityRouter;

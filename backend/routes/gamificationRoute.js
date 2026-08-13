import express from 'express';
import { getLeaderboard } from '../controllers/gamificationController.js';

const gamificationRouter = express.Router();

gamificationRouter.get('/leaderboard', getLeaderboard);

export default gamificationRouter;

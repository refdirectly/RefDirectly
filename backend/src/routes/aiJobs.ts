import express from 'express';
import { searchJobsWithAI, getJobRecommendations } from '../controllers/aiJobController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/search', searchJobsWithAI);
router.post('/recommendations', authMiddleware, getJobRecommendations);

export default router;

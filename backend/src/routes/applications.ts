import express from 'express';
import { createApplication, getApplicationsBySeeker } from '../controllers/applicationController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createApplication);
router.get('/seeker', authMiddleware, getApplicationsBySeeker);

export default router;

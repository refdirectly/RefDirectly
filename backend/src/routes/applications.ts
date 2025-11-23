import express from 'express';
import { createApplication, getApplicationsBySeeker, bulkApply } from '../controllers/applicationController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createApplication);
router.post('/bulk', authMiddleware, bulkApply);
router.get('/seeker', authMiddleware, getApplicationsBySeeker);

export default router;

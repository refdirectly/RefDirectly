import express from 'express';
import { createReferral, getReferralsBySeeker, getReferralsByReferrer, updateReferralStatus } from '../controllers/referralController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createReferral);
router.get('/seeker', authMiddleware, getReferralsBySeeker);
router.get('/referrer', authMiddleware, getReferralsByReferrer);
router.put('/:id/status', authMiddleware, updateReferralStatus);

export default router;

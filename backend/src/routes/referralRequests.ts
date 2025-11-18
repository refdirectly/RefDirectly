import express from 'express';
import { createReferralRequest, acceptReferralRequest, getReferralRequests, completeReferralRequest } from '../controllers/referralRequestController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createReferralRequest);
router.post('/:requestId/accept', authMiddleware, acceptReferralRequest);
router.post('/:requestId/complete', authMiddleware, completeReferralRequest);
router.get('/', authMiddleware, getReferralRequests);

export default router;

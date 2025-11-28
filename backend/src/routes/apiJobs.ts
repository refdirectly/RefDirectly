import express from 'express';
import { requestReferral, getApiJob, getReferralStatus, cancelReferralRequest } from '../controllers/apiJobController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Request referral for API job
router.post('/request-referral', authMiddleware, requestReferral);

// Get API job details
router.get('/job/:jobId', authMiddleware, getApiJob);

// Get referral request status
router.get('/referral/:referralId/status', authMiddleware, getReferralStatus);

// Cancel referral request
router.delete('/referral/:referralId', authMiddleware, cancelReferralRequest);

export default router;

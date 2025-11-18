import express from 'express';
import { createReferral, createReferralWithPayment, verifyUpiPayment, getReferralsBySeeker, getReferralsByReferrer, updateReferralStatus } from '../controllers/referralController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createReferral);
router.post('/with-payment', authMiddleware, createReferralWithPayment);
router.post('/verify-upi', authMiddleware, verifyUpiPayment);
router.get('/seeker', authMiddleware, getReferralsBySeeker);
router.get('/referrer', authMiddleware, getReferralsByReferrer);
router.put('/:id/status', authMiddleware, updateReferralStatus);

export default router;

import express from 'express';
import { getWallet, addFunds, holdPayment, releasePayment, refundPayment, getTransactions, withdraw, simulateReferralComplete } from '../controllers/walletController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/get', authMiddleware, getWallet);
router.post('/add-funds', authMiddleware, addFunds);
router.post('/hold', authMiddleware, holdPayment);
router.post('/release', authMiddleware, releasePayment);
router.post('/refund', authMiddleware, refundPayment);
router.post('/transactions', authMiddleware, getTransactions);
router.post('/withdraw', authMiddleware, withdraw);
router.post('/simulate-complete', authMiddleware, simulateReferralComplete);

export default router;

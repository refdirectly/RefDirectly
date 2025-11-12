import express from 'express';
import { createEscrow, acceptEscrow, completeEscrow, refundEscrow } from '../services/escrowService';
import { authMiddleware } from '../utils/auth';

const router = express.Router();

router.post('/create', authMiddleware, async (req: any, res) => {
  try {
    const { referrerId, referralRequestId, amount } = req.body;
    const escrow = await createEscrow(req.userId, referrerId, referralRequestId, amount);
    res.json({ success: true, escrow });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/accept/:id', authMiddleware, async (req, res) => {
  try {
    const escrow = await acceptEscrow(req.params.id);
    res.json({ success: true, escrow });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/complete/:id', authMiddleware, async (req, res) => {
  try {
    const { proofUrl } = req.body;
    const escrow = await completeEscrow(req.params.id, proofUrl);
    res.json({ success: true, escrow });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/refund/:id', authMiddleware, async (req, res) => {
  try {
    const escrow = await refundEscrow(req.params.id);
    res.json({ success: true, escrow });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

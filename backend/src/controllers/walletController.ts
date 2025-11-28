import { Request, Response } from 'express';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import Referral from '../models/Referral';

const REFERRAL_FEE = 99;
const REFERRER_SHARE = 0.6;
const PLATFORM_SHARE = 0.4;

export const getWallet = async (req: Request, res: Response) => {
  try {
    const { userId, userType } = req.body;
    let wallet = await Wallet.findOne({ userId, userType });
    
    if (!wallet) {
      wallet = await Wallet.create({ userId, userType });
    }
    
    res.json({ success: true, wallet });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addFunds = async (req: Request, res: Response) => {
  try {
    const { userId, userType, amount } = req.body;
    
    const wallet = await Wallet.findOneAndUpdate(
      { userId, userType },
      { $inc: { availableBalance: amount } },
      { new: true, upsert: true }
    );
    
    await Transaction.create({
      userId,
      userType,
      type: 'payment',
      amount,
      status: 'completed',
      description: `Added ₹${amount} to wallet`
    });
    
    res.json({ success: true, wallet });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const holdPayment = async (req: Request, res: Response) => {
  try {
    const { userId, referralId } = req.body;
    
    const wallet = await Wallet.findOne({ userId, userType: 'seeker' });
    if (!wallet || wallet.availableBalance < REFERRAL_FEE) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }
    
    wallet.availableBalance -= REFERRAL_FEE;
    wallet.heldBalance += REFERRAL_FEE;
    wallet.totalSpent += REFERRAL_FEE;
    await wallet.save();
    
    await Transaction.create({
      userId,
      userType: 'seeker',
      type: 'hold',
      amount: REFERRAL_FEE,
      status: 'completed',
      referralId,
      description: `Payment held for referral request`
    });
    
    res.json({ success: true, wallet });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const releasePayment = async (req: Request, res: Response) => {
  try {
    const { referralId } = req.body;
    
    const referral = await Referral.findById(referralId);
    if (!referral) {
      return res.status(404).json({ success: false, message: 'Referral not found' });
    }
    
    const seekerWallet = await Wallet.findOne({ userId: referral.seekerId, userType: 'seeker' });
    if (!seekerWallet || seekerWallet.heldBalance < REFERRAL_FEE) {
      return res.status(400).json({ success: false, message: 'No held payment found' });
    }
    
    seekerWallet.heldBalance -= REFERRAL_FEE;
    await seekerWallet.save();
    
    const referrerAmount = REFERRAL_FEE * REFERRER_SHARE;
    const referrerWallet = await Wallet.findOneAndUpdate(
      { userId: referral.referrerId, userType: 'referrer' },
      { $inc: { availableBalance: referrerAmount, totalEarned: referrerAmount } },
      { new: true, upsert: true }
    );
    
    await Transaction.create([
      {
        userId: referral.seekerId,
        userType: 'seeker',
        type: 'release',
        amount: -REFERRAL_FEE,
        status: 'completed',
        referralId,
        description: `Payment released for completed referral`
      },
      {
        userId: referral.referrerId,
        userType: 'referrer',
        type: 'earning',
        amount: referrerAmount,
        status: 'completed',
        referralId,
        description: `Earned ₹${referrerAmount} from referral`
      }
    ]);
    
    referral.status = 'completed';
    referral.paymentStatus = 'released';
    await referral.save();
    
    res.json({ success: true, message: 'Payment released successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const refundPayment = async (req: Request, res?: Response) => {
  try {
    const { referralId } = req.body;
    
    const referral = await Referral.findById(referralId);
    if (!referral) {
      if (res) return res.status(404).json({ success: false, message: 'Referral not found' });
      return;
    }
    
    const wallet = await Wallet.findOne({ userId: referral.seekerId, userType: 'seeker' });
    if (!wallet || wallet.heldBalance < REFERRAL_FEE) {
      if (res) return res.status(400).json({ success: false, message: 'No held payment found' });
      return;
    }
    
    wallet.heldBalance -= REFERRAL_FEE;
    wallet.availableBalance += REFERRAL_FEE;
    wallet.totalSpent -= REFERRAL_FEE;
    await wallet.save();
    
    await Transaction.create({
      userId: referral.seekerId,
      userType: 'seeker',
      type: 'refund',
      amount: REFERRAL_FEE,
      status: 'completed',
      referralId,
      description: `Refund for expired referral request`
    });
    
    referral.status = 'expired';
    referral.paymentStatus = 'refunded';
    await referral.save();
    
    if (res) res.json({ success: true, wallet });
  } catch (error: any) {
    if (res) res.status(500).json({ success: false, message: error.message });
    throw error;
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { userId, userType } = req.body;
    
    const transactions = await Transaction.find({ userId, userType })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ success: true, transactions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const withdraw = async (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body;
    
    const wallet = await Wallet.findOne({ userId, userType: 'referrer' });
    if (!wallet || wallet.availableBalance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }
    
    wallet.availableBalance -= amount;
    await wallet.save();
    
    await Transaction.create({
      userId,
      userType: 'referrer',
      type: 'payment',
      amount: -amount,
      status: 'completed',
      description: `Withdrew ₹${amount} to bank account`
    });
    
    res.json({ success: true, wallet, message: 'Withdrawal successful' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const simulateReferralComplete = async (req: Request, res: Response) => {
  try {
    const { seekerId, referrerId } = req.body;
    
    // Create dummy referral
    const referral = await Referral.create({
      seekerId,
      referrerId,
      jobId: '000000000000000000000000',
      status: 'pending',
      paymentStatus: 'held',
      reward: REFERRAL_FEE,
      seekerProfile: {
        name: 'Test User',
        email: 'test@example.com',
        skills: ['JavaScript'],
        experience: '2 years'
      }
    });
    
    // Hold payment
    await holdPayment({ body: { userId: seekerId, referralId: referral._id } } as Request, res);
    
    // Simulate completion after 2 seconds
    setTimeout(async () => {
      await releasePayment({ body: { referralId: referral._id } } as Request, {} as Response);
      console.log('Simulated referral completed and payment released');
    }, 2000);
    
    res.json({ success: true, message: 'Referral simulation started', referralId: referral._id });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkExpiredReferrals = async () => {
  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    
    const expiredReferrals = await Referral.find({
      status: 'pending',
      createdAt: { $lt: threeDaysAgo }
    });
    
    for (const referral of expiredReferrals) {
      await refundPayment({ body: { referralId: referral._id } } as Request);
    }
    
    console.log(`Processed ${expiredReferrals.length} expired referrals`);
  } catch (error) {
    console.error('Error checking expired referrals:', error);
  }
};

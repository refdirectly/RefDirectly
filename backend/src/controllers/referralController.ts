import { Response } from 'express';
import Referral from '../models/Referral';
import Job from '../models/Job';
import { AuthRequest } from '../middleware/auth';
import { createEscrow } from '../services/escrowService';
import ReferralRequest from '../models/ReferralRequest';

export const createReferral = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId, referrerId, message, seekerProfile, reward, company, role } = req.body;
    const seekerId = req.user?.userId;

    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

    const referral = new Referral({
      jobId: jobId && isValidObjectId(jobId) ? jobId : undefined,
      seekerId,
      referrerId: referrerId && isValidObjectId(referrerId) ? referrerId : undefined,
      company: company || 'Unknown Company',
      role: role || 'Unknown Position',
      reward: reward || 99,
      message,
      seekerProfile
    });

    await referral.save();

    res.status(201).json({ success: true, referral });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create referral' });
  }
};

export const getReferralsBySeeker = async (req: AuthRequest, res: Response) => {
  try {
    const referrals = await Referral.find({ seekerId: req.user?.userId })
      .populate('jobId')
      .populate('referrerId', 'name email companies')
      .sort({ createdAt: -1 });
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch referrals' });
  }
};

export const getReferralsByReferrer = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const filter: any = {};
    
    // If referrerId exists, filter by it, otherwise show all
    if (req.user?.userId) {
      filter.$or = [
        { referrerId: req.user.userId },
        { referrerId: null },
        { referrerId: { $exists: false } }
      ];
    }
    
    if (status) filter.status = status;

    const referrals = await Referral.find(filter)
      .populate('jobId')
      .populate('seekerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch referrals' });
  }
};

export const createReferralWithPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId, company, role, amount, message, seekerProfile, paymentDetails } = req.body;
    const seekerId = req.user?.userId;

    if (!seekerId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Validate payment details based on method
    if (!paymentDetails) {
      return res.status(400).json({ success: false, message: 'Payment details required' });
    }

    let qrCode = null;
    
    // Handle UPI payment
    if (paymentDetails.method === 'upi') {
      // Generate UPI QR code (using a simple UPI URL format)
      const upiId = '9555219911@ybl'; // Your UPI ID
      const upiUrl = `upi://pay?pa=${upiId}&pn=RefDirectly&am=${amount}&cu=INR&tn=Referral Payment for ${company}`;
      
      // In production, use a proper QR code library
      qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
    }

    // Create referral request
    const referralRequest = new ReferralRequest({
      seekerId,
      company,
      role,
      message,
      seekerProfile,
      status: 'pending',
      amount
    });

    await referralRequest.save();

    // Create escrow transaction (using a dummy referrer ID for now)
    const dummyReferrerId = '507f1f77bcf86cd799439011'; // Will be updated when referrer accepts
    const escrow = await createEscrow(seekerId, dummyReferrerId, referralRequest._id.toString(), amount);

    const response: any = { 
      success: true, 
      referralRequest,
      escrow: {
        id: escrow._id,
        amount: escrow.amount,
        expiryAt: escrow.expiryAt,
        status: escrow.status
      },
      message: paymentDetails.method === 'upi' ? 'UPI QR code generated. Complete payment to proceed.' : 'Payment processed and held in escrow. Referrer will be notified.'
    };

    if (qrCode) {
      response.qrCode = qrCode;
    }

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Payment processing error:', error);
    res.status(500).json({ success: false, message: error.message || 'Payment processing failed' });
  }
};

export const verifyUpiPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { referralRequestId, transactionId } = req.body;
    const seekerId = req.user?.userId;

    if (!seekerId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // In production, verify with actual UPI gateway
    // For demo, we'll simulate verification
    const isVerified = transactionId && transactionId.length > 5;

    if (isVerified) {
      // Update referral request status
      await ReferralRequest.findByIdAndUpdate(referralRequestId, {
        status: 'payment_verified'
      });

      res.json({ 
        success: true, 
        message: 'Payment verified successfully. Referrer will be notified.' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed. Please try again.' 
      });
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

export const updateReferralStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const updateData: any = { status };
    
    if (status === 'accepted') {
      updateData.referrerId = req.user?.userId;
    }
    
    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!referral) return res.status(404).json({ error: 'Referral not found' });
    res.json(referral);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update referral' });
  }
};

import { Response } from 'express';
import Referral from '../models/Referral';
import Job from '../models/Job';
import { AuthRequest } from '../middleware/auth';

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

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import ReferralRequest from '../models/ReferralRequest';
import User from '../models/User';
import Notification from '../models/Notification';
import ChatRoom from '../models/ChatRoom';
import JobPosting from '../models/JobPosting';

export const createReferralRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { jobPostingId } = req.body;
    const seekerId = req.user?.userId;

    const jobPosting = await JobPosting.findById(jobPostingId);
    if (!jobPosting) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    const seeker = await User.findById(seekerId);
    if (!seeker) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const eligibleReferrers = await User.find({
      role: 'referrer',
      'companies.name': jobPosting.company,
      'companies.verified': true
    });

    if (eligibleReferrers.length === 0) {
      return res.status(404).json({ success: false, message: 'No eligible referrers found for this company' });
    }

    const referralRequest = new ReferralRequest({
      seekerId,
      company: jobPosting.company,
      role: jobPosting.title,
      skills: jobPosting.requirements || [],
      description: jobPosting.description,
      resumeUrl: seeker.linkedinUrl || '',
      reward: jobPosting.referralReward,
      status: 'pending'
    });

    await referralRequest.save();

    const notificationPromises = eligibleReferrers.map(async (referrer) => {
      return Notification.create({
        userId: referrer._id,
        type: 'referral_request',
        title: `New Referral Request - ${jobPosting.company}`,
        message: `${jobPosting.title} at ${jobPosting.company}. Reward: $${jobPosting.referralReward}`,
        status: 'waiting',
        jobRequestId: referralRequest._id,
        metadata: {
          company: jobPosting.company,
          role: jobPosting.title,
          location: jobPosting.location,
          reward: jobPosting.referralReward,
          seekerId,
          jobPostingId
        }
      });
    });

    await Promise.all(notificationPromises);

    res.status(201).json({ 
      success: true, 
      message: `Request sent to ${eligibleReferrers.length} referrer(s)`,
      notificationsSent: eligibleReferrers.length
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptReferralRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    const referrerId = req.user?.userId;

    const referralRequest = await ReferralRequest.findOneAndUpdate(
      { _id: requestId, status: 'pending' },
      { 
        status: 'accepted',
        acceptedBy: referrerId,
        acceptedAt: new Date()
      },
      { new: true }
    );

    if (!referralRequest) {
      return res.status(409).json({ 
        success: false, 
        message: 'Request already accepted by another referrer' 
      });
    }

    const chatRoom = new ChatRoom({
      participants: [referralRequest.seekerId, referrerId],
      lastMessage: 'Referral request accepted',
      lastMessageAt: new Date()
    });
    await chatRoom.save();

    await ReferralRequest.findByIdAndUpdate(referralRequest._id, { chatRoomId: chatRoom._id });

    await Notification.updateMany(
      { jobRequestId: requestId, userId: { $ne: referrerId }, status: 'waiting' },
      { status: 'rejected' }
    );

    await Notification.findOneAndUpdate(
      { jobRequestId: requestId, userId: referrerId },
      { status: 'in_progress', acceptedAt: new Date() }
    );

    await Notification.create({
      userId: referralRequest.seekerId,
      type: 'referral_accepted',
      title: 'Referral Request Accepted',
      message: `A referrer has accepted your request for ${referralRequest.role} at ${referralRequest.company}`,
      status: 'completed',
      jobRequestId: requestId
    });

    res.json({ success: true, referralRequest, chatRoomId: chatRoom._id });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const completeReferralRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    const referrerId = req.user?.userId;

    const referralRequest = await ReferralRequest.findOneAndUpdate(
      { _id: requestId, acceptedBy: referrerId, status: 'accepted' },
      { 
        status: 'completed',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!referralRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    await Notification.findOneAndUpdate(
      { jobRequestId: requestId, userId: referrerId },
      { status: 'completed', completedAt: new Date() }
    );

    await Notification.create({
      userId: referralRequest.seekerId,
      type: 'application_update',
      title: 'Referral Submitted',
      message: `Your referral for ${referralRequest.role} at ${referralRequest.company} has been submitted`,
      status: 'completed',
      jobRequestId: requestId
    });

    res.json({ success: true, referralRequest });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

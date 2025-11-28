import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import ApiJob from '../models/ApiJob';
import Referral from '../models/Referral';
import User from '../models/User';
import Subscription from '../models/Subscription';
import { notifyNewReferralRequest } from '../services/notificationService';
import { io } from '../server';

interface ReferralRequestBody {
  title: string;
  company: string;
  location?: string;
  description?: string;
  jobUrl?: string;
  employerLogo?: string;
  employmentType?: string;
  datePosted?: string;
}

export const requestReferral = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { title, company, location, description, jobUrl, employerLogo, employmentType, datePosted }: ReferralRequestBody = req.body;

    // Validation
    if (!title || !company) {
      return res.status(400).json({ 
        success: false, 
        message: 'Job title and company are required' 
      });
    }

    // Check subscription and tokens
    const subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      return res.status(403).json({ 
        success: false, 
        message: 'No subscription found. Please subscribe to request referrals.' 
      });
    }

    if (subscription.tokensUsed >= subscription.tokens) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tokens remaining. Please upgrade your plan to continue.',
        tokensRemaining: 0
      });
    }

    // Check for duplicate request within last 24 hours
    const recentRequest = await Referral.findOne({
      seekerId: userId,
      company: { $regex: new RegExp(`^${company}$`, 'i') },
      role: { $regex: new RegExp(`^${title}$`, 'i') },
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (recentRequest) {
      return res.status(409).json({ 
        success: false, 
        message: 'You have already requested a referral for this position within the last 24 hours' 
      });
    }

    // Generate unique job ID with timestamp prefix for better tracking
    const jobId = `jsearch_${Date.now()}_${uuidv4()}`;

    // Store API job with enhanced metadata
    const apiJob = await ApiJob.create({
      jobId,
      title: title.trim(),
      company: company.trim(),
      location: location?.trim(),
      description: description?.trim(),
      source: 'jsearch',
      jobUrl,
      employerLogo,
      employmentType,
      datePosted
    });

    // Find active verified referrers at this company
    const referrers = await User.find({ 
      role: 'referrer',
      verified: true,
      company: { $regex: new RegExp(`^${company}$`, 'i') }
    }).select('_id name email company');

    if (referrers.length === 0) {
      // Clean up created job if no referrers found
      await ApiJob.findByIdAndDelete(apiJob._id);
      
      return res.status(404).json({ 
        success: false, 
        message: 'No verified referrers currently available at this company. Please try again later or explore other opportunities.' 
      });
    }

    // Get seeker profile
    const seeker = await User.findById(userId).select('name email');

    // Create referral request with enhanced tracking
    const referral = await Referral.create({
      seekerId: userId,
      company: company.trim(),
      role: title.trim(),
      location: location?.trim(),
      status: 'pending',
      jobId: apiJob._id,
      source: 'jsearch',
      reward: 5000,
      seekerProfile: {
        name: seeker?.name || 'Job Seeker',
        email: seeker?.email || '',
        skills: [],
        experience: ''
      }
    });

    // Broadcast to all matching referrers via Socket.IO for real-time notification
    const notificationPromises = referrers.map(async (referrer) => {
      // Create notification
      await notifyNewReferralRequest(
        referrer._id.toString(),
        seeker?.name || 'Candidate',
        company,
        title,
        referral._id.toString()
      );
      
      // Real-time Socket.IO broadcast
      io.to(referrer._id.toString()).emit('new_referral_request', {
        referralId: referral._id,
        company,
        role: title,
        location,
        timestamp: new Date()
      });
    });

    await Promise.all(notificationPromises);

    // Deduct token
    subscription.tokensUsed += 1;
    await subscription.save();

    res.status(201).json({ 
      success: true, 
      message: `Referral request successfully broadcast to ${referrers.length} verified professional${referrers.length > 1 ? 's' : ''}`,
      data: {
        referralId: referral._id,
        jobId: apiJob.jobId,
        company,
        role: title,
        referrersNotified: referrers.length,
        status: 'pending',
        tokensRemaining: subscription.tokens - subscription.tokensUsed
      }
    });
  } catch (error: any) {
    console.error('Referral request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process referral request. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getApiJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    
    if (!jobId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Job ID is required' 
      });
    }

    const job = await ApiJob.findOne({ jobId }).lean();
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job listing not found or has expired' 
      });
    }
    
    // Check if job is older than 30 days (stale data)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (job.createdAt < thirtyDaysAgo) {
      return res.status(410).json({ 
        success: false, 
        message: 'Job listing has expired. Please search for current opportunities.' 
      });
    }
    
    res.json({ 
      success: true, 
      data: job 
    });
  } catch (error: any) {
    console.error('Get API job error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve job details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getReferralStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { referralId } = req.params;

    const referral = await Referral.findOne({ 
      _id: referralId, 
      seekerId: userId 
    })
    .populate('referrerId', 'name company')
    .populate('jobId')
    .lean();

    if (!referral) {
      return res.status(404).json({ 
        success: false, 
        message: 'Referral request not found' 
      });
    }

    res.json({ 
      success: true, 
      data: {
        referralId: referral._id,
        status: referral.status,
        company: referral.company,
        role: referral.role,
        referrer: referral.referrerId ? {
          name: (referral.referrerId as any).name,
          company: (referral.referrerId as any).company
        } : null,
        createdAt: referral.createdAt,
        updatedAt: referral.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Get referral status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve referral status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const cancelReferralRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { referralId } = req.params;

    const referral = await Referral.findOne({ 
      _id: referralId, 
      seekerId: userId,
      status: 'pending'
    });

    if (!referral) {
      return res.status(404).json({ 
        success: false, 
        message: 'Referral request not found or cannot be cancelled' 
      });
    }

    referral.status = 'rejected';
    await referral.save();

    res.json({ 
      success: true, 
      message: 'Referral request cancelled successfully' 
    });
  } catch (error: any) {
    console.error('Cancel referral error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel referral request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

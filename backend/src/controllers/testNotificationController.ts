import { Request, Response } from 'express';
import {
  notifySeekerReferralAccepted,
  notifySeekerInterviewScheduled,
  notifyReferrerNewRequest,
  notifyReferrerPaymentReceived
} from '../utils/roleBasedNotifications';

export const testSeekerNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    await notifySeekerReferralAccepted(
      userId,
      'John Referrer',
      'Google',
      'Senior Software Engineer'
    );
    
    await notifySeekerInterviewScheduled(
      userId,
      'Microsoft',
      'Product Manager',
      'December 25, 2024 at 10:00 AM'
    );
    
    res.json({ 
      success: true, 
      message: 'Test notifications sent for job seeker' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send test notifications' });
  }
};

export const testReferrerNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    await notifyReferrerNewRequest(
      userId,
      'Jane Seeker',
      'Amazon',
      'Software Development Engineer',
      750
    );
    
    await notifyReferrerPaymentReceived(
      userId,
      500,
      'John Seeker',
      'Apple'
    );
    
    res.json({ 
      success: true, 
      message: 'Test notifications sent for referrer' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send test notifications' });
  }
};

import { Request, Response } from 'express';
import Subscription from '../models/Subscription';
import User from '../models/User';

export const getSubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    
    let subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      subscription = await Subscription.create({
        userId,
        plan: 'free',
        tokens: 3,
        tokensUsed: 0
      });
    }
    
    res.json({ 
      success: true, 
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        tokens: subscription.tokens,
        tokensUsed: subscription.tokensUsed,
        tokensRemaining: subscription.tokens - subscription.tokensUsed,
        billingCycle: subscription.billingCycle,
        amount: subscription.amount,
        endDate: subscription.endDate,
        autoRenew: subscription.autoRenew
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { plan, billingCycle, paymentMethod, transactionId } = req.body;

    if (!['professional', 'enterprise'].includes(plan)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid plan selected' 
      });
    }

    const planConfig = {
      professional: {
        tokens: 15,
        monthly: 999,
        annual: 9990
      },
      enterprise: {
        tokens: 999999,
        monthly: 0,
        annual: 0
      }
    };

    const config = planConfig[plan as 'professional' | 'enterprise'];
    const amount = billingCycle === 'annual' ? config.annual : config.monthly;
    const duration = billingCycle === 'annual' ? 365 : 30;

    const subscription = await Subscription.findOneAndUpdate(
      { userId },
      {
        plan,
        status: 'active',
        tokens: config.tokens,
        tokensUsed: 0,
        billingCycle,
        amount,
        startDate: new Date(),
        endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
        autoRenew: true,
        paymentMethod,
        transactionId
      },
      { new: true, upsert: true }
    );

    res.status(201).json({ 
      success: true, 
      message: 'Subscription activated successfully',
      subscription 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const useToken = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    
    const subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        message: 'No subscription found' 
      });
    }

    if (subscription.tokensUsed >= subscription.tokens) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tokens remaining. Please upgrade your plan.' 
      });
    }

    subscription.tokensUsed += 1;
    await subscription.save();

    res.json({ 
      success: true, 
      tokensRemaining: subscription.tokens - subscription.tokensUsed 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const refundToken = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    
    const subscription = await Subscription.findOne({ userId });
    
    if (!subscription || subscription.tokensUsed === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No tokens to refund' 
      });
    }

    subscription.tokensUsed -= 1;
    await subscription.save();

    res.json({ 
      success: true, 
      message: 'Token refunded successfully',
      tokensRemaining: subscription.tokens - subscription.tokensUsed 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    
    const subscription = await Subscription.findOneAndUpdate(
      { userId },
      { 
        status: 'cancelled',
        autoRenew: false
      },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        message: 'No subscription found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Subscription cancelled. Your tokens remain valid until the end of the billing period.',
      subscription 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const upgradeSubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { plan, billingCycle, transactionId } = req.body;

    const subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        message: 'No subscription found' 
      });
    }

    const planConfig = {
      professional: { tokens: 15, monthly: 999, annual: 9990 },
      enterprise: { tokens: 999999, monthly: 0, annual: 0 }
    };

    const config = planConfig[plan as 'professional' | 'enterprise'];
    const amount = billingCycle === 'annual' ? config.annual : config.monthly;
    const duration = billingCycle === 'annual' ? 365 : 30;

    subscription.plan = plan;
    subscription.status = 'active';
    subscription.tokens = config.tokens;
    subscription.tokensUsed = 0;
    subscription.billingCycle = billingCycle;
    subscription.amount = amount;
    subscription.startDate = new Date();
    subscription.endDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    subscription.transactionId = transactionId;
    
    await subscription.save();

    res.json({ 
      success: true, 
      message: 'Subscription upgraded successfully',
      subscription 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

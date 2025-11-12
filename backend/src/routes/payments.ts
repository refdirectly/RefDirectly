import express from 'express';
import Stripe from 'stripe';
import Transaction from '../models/Transaction';
import ReferralRequest from '../models/ReferralRequest';
import { authMiddleware, AuthRequest } from '../utils/auth';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

// Initiate payment (create PaymentIntent for escrow)
router.post('/initiate', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (req.userRole !== 'seeker') {
      return res.status(403).json({ message: 'Only seekers can initiate payments' });
    }

    // Create PaymentIntent with manual capture for escrow
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      capture_method: 'manual', // Hold funds until manual capture
      metadata: {
        seekerId: req.userId!,
        type: 'referral_escrow'
      }
    });

    // Create transaction record
    const transaction = await Transaction.create({
      userId: req.userId,
      userType: 'seeker',
      type: 'hold',
      amount,
      status: 'completed',
      description: `Payment held in escrow - ₹${amount}`
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      paymentId: transaction._id
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ message: 'Failed to initiate payment' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send('Webhook signature verification failed');
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

// Release escrow payment to referrer
router.post('/:id/release', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Only admin or the seeker can release payment
    if (req.userRole !== 'admin' && transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (transaction.type !== 'hold') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    // Update transaction status
    transaction.type = 'release';
    await transaction.save();

    // Update referral request status
    await ReferralRequest.updateOne(
      { paymentId: transaction._id },
      { status: 'completed' }
    );

    res.json({ message: 'Payment released successfully' });

  } catch (error) {
    console.error('Payment release error:', error);
    res.status(500).json({ message: 'Failed to release payment' });
  }
});

// Get payment history
router.get('/history', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const filter: any = {};
    
    if (req.userRole === 'seeker' || req.userRole === 'referrer') {
      filter.userId = req.userId;
    } else if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 });

    res.json({ transactions });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper functions
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment confirmed: ${paymentIntent.id}`);
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment failed: ${paymentIntent.id}`);
}

export default router;
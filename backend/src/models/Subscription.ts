import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  plan: { type: String, enum: ['free', 'professional', 'enterprise'], default: 'free' },
  status: { type: String, enum: ['active', 'cancelled', 'expired', 'trial'], default: 'active' },
  tokens: { type: Number, default: 3 },
  tokensUsed: { type: Number, default: 0 },
  billingCycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
  amount: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  autoRenew: { type: Boolean, default: true },
  paymentMethod: { type: String },
  transactionId: { type: String }
}, { timestamps: true });

subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ status: 1, endDate: 1 });

export default mongoose.model('Subscription', subscriptionSchema);

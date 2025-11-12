import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  userType: 'seeker' | 'referrer';
  type: 'payment' | 'hold' | 'release' | 'refund' | 'earning';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  referralId?: mongoose.Types.ObjectId;
  description: string;
  createdAt: Date;
}

const TransactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  userType: { type: String, enum: ['seeker', 'referrer'], required: true },
  type: { type: String, enum: ['payment', 'hold', 'release', 'refund', 'earning'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  referralId: { type: Schema.Types.ObjectId, ref: 'Referral' },
  description: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);

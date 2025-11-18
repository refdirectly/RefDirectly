import mongoose, { Document, Schema } from 'mongoose';

export interface IReferralRequest extends Document {
  seekerId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  skills: string[];
  description?: string;
  message?: string;
  seekerProfile?: {
    name: string;
    email: string;
  };
  resumeUrl?: string;
  reward?: number;
  amount?: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'referred' | 'completed' | 'cancelled';
  createdAt: Date;
  acceptedBy?: mongoose.Types.ObjectId;
  acceptedAt?: Date;
  chatRoomId?: mongoose.Types.ObjectId;
  expiresAt?: Date;
  paymentId?: mongoose.Types.ObjectId;
}

const ReferralRequestSchema = new Schema<IReferralRequest>({
  seekerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  skills: [String],
  description: String,
  message: String,
  seekerProfile: {
    name: String,
    email: String
  },
  resumeUrl: String,
  reward: {
    type: Number,
    min: 0
  },
  amount: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'referred', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  acceptedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  acceptedAt: Date,
  chatRoomId: {
    type: Schema.Types.ObjectId,
    ref: 'ChatRoom'
  },
  expiresAt: Date,
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction'
  }
});

export default mongoose.model<IReferralRequest>('ReferralRequest', ReferralRequestSchema);
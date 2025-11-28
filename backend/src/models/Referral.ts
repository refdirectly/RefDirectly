import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  jobId: mongoose.Types.ObjectId;
  seekerId: mongoose.Types.ObjectId;
  referrerId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  location?: string;
  source?: 'manual' | 'jsearch';
  status: 'pending' | 'accepted' | 'rejected' | 'interview' | 'hired' | 'completed' | 'expired';
  paymentStatus?: 'held' | 'released' | 'refunded';
  reward: number;
  message?: string;
  resumeUrl?: string;
  seekerProfile: {
    name: string;
    email: string;
    skills: string[];
    experience: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema = new Schema<IReferral>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: false },
  seekerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String },
  source: { type: String, enum: ['manual', 'jsearch'], default: 'manual' },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'interview', 'hired', 'completed', 'expired'],
    default: 'pending'
  },
  paymentStatus: { 
    type: String, 
    enum: ['held', 'released', 'refunded']
  },
  reward: { type: Number, required: true },
  message: String,
  resumeUrl: String,
  seekerProfile: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    skills: [String],
    experience: String
  }
}, { timestamps: true });

export default mongoose.model<IReferral>('Referral', ReferralSchema);

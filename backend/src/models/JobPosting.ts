import mongoose, { Schema, Document } from 'mongoose';

export interface IJobPosting extends Document {
  organizationId: mongoose.Types.ObjectId;
  organizationName: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements: string[];
  referralReward: number;
  status: 'active' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const JobPostingSchema = new Schema({
  organizationId: { type: String, required: true },
  organizationName: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, default: 'Full-time' },
  salary: String,
  description: { type: String, required: true },
  requirements: [String],
  referralReward: { type: Number, default: 99 },
  status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, { timestamps: true });

export default mongoose.model<IJobPosting>('JobPosting', JobPostingSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  salary?: string;
  description: string;
  requirements: string[];
  skills: string[];
  benefits?: string[];
  referralReward: number;
  status: 'active' | 'closed' | 'draft';
  postedBy?: mongoose.Types.ObjectId;
  applicants: number;
  referrals: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: String,
  location: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: true 
  },
  experience: { type: String, required: true },
  salary: String,
  description: { type: String, required: true },
  requirements: [String],
  skills: [String],
  benefits: [String],
  referralReward: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  applicants: { type: Number, default: 0 },
  referrals: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IJob>('Job', JobSchema);

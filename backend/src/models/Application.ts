import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  jobId?: mongoose.Types.ObjectId;
  seekerId: string;
  externalJobId?: string;
  jobUrl?: string;
  jobTitle?: string;
  company?: string;
  status: 'applied' | 'reviewing' | 'interview' | 'rejected' | 'accepted';
  resumeUrl?: string;
  coverLetter?: string;
  aiGenerated: boolean;
  appliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
  seekerId: { type: Schema.Types.Mixed, required: true },
  externalJobId: { type: String },
  jobUrl: { type: String },
  jobTitle: { type: String },
  company: { type: String },
  status: { 
    type: String, 
    enum: ['applied', 'reviewing', 'interview', 'rejected', 'accepted'],
    default: 'applied'
  },
  resumeUrl: String,
  coverLetter: String,
  aiGenerated: { type: Boolean, default: false },
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);

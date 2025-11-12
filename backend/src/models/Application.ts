import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  seekerId: mongoose.Types.ObjectId;
  status: 'applied' | 'reviewing' | 'interview' | 'rejected' | 'accepted';
  resumeUrl?: string;
  coverLetter?: string;
  aiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  seekerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['applied', 'reviewing', 'interview', 'rejected', 'accepted'],
    default: 'applied'
  },
  resumeUrl: String,
  coverLetter: String,
  aiGenerated: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);

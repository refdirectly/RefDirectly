import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  role: 'seeker' | 'referrer' | 'admin';
  name?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  phone?: string;
  linkedinUrl?: string;
  linkedinPassword?: string;
  resumeUrl?: string;
  experience?: number;
  currentCompany?: string;
  currentTitle?: string;
  skills?: string[];
  companies: Array<{
    name: string;
    verified: boolean;
    roles: string[];
  }>;
  pricePerReferral?: number;
  rating?: number;
  verified: boolean;
  createdAt: Date;
  lastSeenAt: Date;
  avatarUrl?: string;
  bio?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>({
  role: {
    type: String,
    enum: ['seeker', 'referrer', 'admin'],
    required: true
  },
  name: String,
  displayName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  phone: String,
  linkedinUrl: String,
  linkedinPassword: String,
  resumeUrl: String,
  experience: Number,
  currentCompany: String,
  currentTitle: String,
  skills: [String],
  companies: [{
    name: String,
    verified: { type: Boolean, default: false },
    roles: [String]
  }],
  pricePerReferral: Number,
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastSeenAt: {
    type: Date,
    default: Date.now
  },
  avatarUrl: String,
  bio: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

export default mongoose.model<IUser>('User', UserSchema);
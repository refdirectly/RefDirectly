import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  userRole: 'seeker' | 'referrer';
  type: 'referral_request' | 'referral_accepted' | 'referral_rejected' | 'payment_received' | 'payment_sent' | 'interview_scheduled' | 'application_update' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userRole: { type: String, enum: ['seeker', 'referrer'], required: true, index: true },
  type: { 
    type: String, 
    enum: ['referral_request', 'referral_accepted', 'referral_rejected', 'payment_received', 'payment_sent', 'interview_scheduled', 'application_update', 'message', 'system'], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false, index: true },
  link: String,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  metadata: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, index: true }
});

NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, userRole: 1, read: 1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);

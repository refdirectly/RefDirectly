import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: [
      'referral_request', 'referral_accepted', 'referral_rejected', 'referral_completed',
      'application_submitted', 'application_update', 'interview_scheduled',
      'payment_received', 'payment_pending', 'wallet_update',
      'message_received', 'chat_started',
      'job_match', 'job_alert',
      'system', 'welcome'
    ], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  referralId: { type: mongoose.Schema.Types.ObjectId, ref: 'Referral' },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  link: { type: String },
  actionLabel: { type: String },
  icon: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  jobRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Referral' },
  status: { type: String, enum: ['waiting', 'in_progress', 'rejected', 'completed'], default: 'waiting' },
  acceptedAt: { type: Date }
}, { timestamps: true });

notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ jobRequestId: 1, status: 1 });

export default mongoose.model('Notification', notificationSchema);

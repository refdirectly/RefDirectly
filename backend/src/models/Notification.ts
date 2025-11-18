import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['job_match', 'application_update', 'payment', 'referral_request', 'referral_accepted', 'message'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  status: { type: String, enum: ['waiting', 'in_progress', 'completed', 'rejected', 'expired'], default: 'waiting' },
  referralId: { type: mongoose.Schema.Types.ObjectId, ref: 'Referral' },
  jobRequestId: { type: mongoose.Schema.Types.ObjectId },
  acceptedAt: { type: Date },
  completedAt: { type: Date },
  link: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ jobRequestId: 1, status: 1 });

export default mongoose.model('Notification', notificationSchema);

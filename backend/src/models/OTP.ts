import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, index: true },
  otp: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 3 },
  blocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 600 } // 10 minutes
});

otpSchema.index({ email: 1, createdAt: 1 });

export default mongoose.model('OTP', otpSchema);

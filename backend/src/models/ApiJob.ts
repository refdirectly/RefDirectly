import mongoose from 'mongoose';

const apiJobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true, index: true },
  location: { type: String, trim: true },
  description: { type: String, trim: true },
  source: { type: String, default: 'jsearch', enum: ['jsearch', 'linkedin', 'indeed', 'manual'] },
  jobUrl: { type: String, trim: true },
  employerLogo: { type: String, trim: true },
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'] },
  datePosted: { type: String },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // 30 days
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Index for efficient queries
apiJobSchema.index({ company: 1, title: 1 });
apiJobSchema.index({ createdAt: -1 });
apiJobSchema.index({ expiresAt: 1 });

// TTL index to auto-delete expired jobs after 30 days
apiJobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('ApiJob', apiJobSchema);

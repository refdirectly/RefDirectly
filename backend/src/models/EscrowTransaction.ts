import mongoose from 'mongoose';

const escrowTransactionSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referralRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralRequest', required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending_acceptance', 'in_progress', 'completed', 'refunded', 'disputed'],
    default: 'pending_acceptance'
  },
  createdAt: { type: Date, default: Date.now },
  expiryAt: { type: Date, required: true },
  completedAt: { type: Date },
  proofUrl: { type: String }
});

export default mongoose.model('EscrowTransaction', escrowTransactionSchema);

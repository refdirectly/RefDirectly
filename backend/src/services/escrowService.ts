import EscrowTransaction from '../models/EscrowTransaction';
import Wallet from '../models/Wallet';

export const createEscrow = async (candidateId: string, referrerId: string, referralRequestId: string, amount: number) => {
  const expiryAt = new Date();
  expiryAt.setDate(expiryAt.getDate() + 3); // 3 days

  const escrow = await EscrowTransaction.create({
    candidateId,
    referrerId,
    referralRequestId,
    amount,
    expiryAt
  });

  // Deduct from candidate wallet and add to escrow
  await Wallet.findOneAndUpdate(
    { userId: candidateId },
    { $inc: { balance: -amount, escrowBalance: amount } },
    { upsert: true }
  );

  return escrow;
};

export const acceptEscrow = async (escrowId: string) => {
  return await EscrowTransaction.findByIdAndUpdate(
    escrowId,
    { status: 'in_progress' },
    { new: true }
  );
};

export const completeEscrow = async (escrowId: string, proofUrl?: string) => {
  const escrow = await EscrowTransaction.findById(escrowId);
  if (!escrow) throw new Error('Escrow not found');

  // Release funds to referrer (60% after platform fee)
  const referrerAmount = escrow.amount * 0.6;
  
  await Wallet.findOneAndUpdate(
    { userId: escrow.referrerId },
    { $inc: { balance: referrerAmount, totalEarned: referrerAmount } },
    { upsert: true }
  );

  // Remove from candidate escrow
  await Wallet.findOneAndUpdate(
    { userId: escrow.candidateId },
    { $inc: { escrowBalance: -escrow.amount } }
  );

  return await EscrowTransaction.findByIdAndUpdate(
    escrowId,
    { status: 'completed', completedAt: new Date(), proofUrl },
    { new: true }
  );
};

export const refundEscrow = async (escrowId: string) => {
  const escrow = await EscrowTransaction.findById(escrowId);
  if (!escrow) throw new Error('Escrow not found');

  // Refund to candidate
  await Wallet.findOneAndUpdate(
    { userId: escrow.candidateId },
    { $inc: { balance: escrow.amount, escrowBalance: -escrow.amount } }
  );

  return await EscrowTransaction.findByIdAndUpdate(
    escrowId,
    { status: 'refunded', completedAt: new Date() },
    { new: true }
  );
};

export const checkExpiredEscrows = async () => {
  const expired = await EscrowTransaction.find({
    status: 'in_progress',
    expiryAt: { $lt: new Date() }
  });

  for (const escrow of expired) {
    await refundEscrow(escrow._id.toString());
  }

  return expired.length;
};

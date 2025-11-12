# Wallet-Based Escrow System - ReferUs

## Overview
Complete transparent payment system with escrow logic for referral transactions.

## System Flow

### 1. Payment Initiation
- User clicks "Get Referral" → triggers payment modal
- Fee: ₹99 per referral request
- Checks wallet balance before proceeding

### 2. Escrow Hold
- ₹99 moves from `availableBalance` → `heldBalance`
- Referral request created with status: `pending`
- Payment status: `held`
- Transaction recorded in history

### 3. Referrer Response (3-day window)
**Option A: Completed**
- Referrer accepts and completes referral
- Payment released: 60% to referrer (₹59.40), 40% platform (₹39.60)
- Status: `completed`, Payment: `released`

**Option B: Timeout**
- No response within 3 days
- Full ₹99 refunded to user's `availableBalance`
- Status: `expired`, Payment: `refunded`

## Database Models

### Wallet Schema
```typescript
{
  userId: ObjectId,
  userType: 'seeker' | 'referrer',
  availableBalance: Number,  // Can be withdrawn/used
  heldBalance: Number,       // In escrow
  totalEarned: Number,       // Lifetime earnings
  totalSpent: Number         // Lifetime spending
}
```

### Transaction Schema
```typescript
{
  userId: ObjectId,
  userType: 'seeker' | 'referrer',
  type: 'payment' | 'hold' | 'release' | 'refund' | 'earning',
  amount: Number,
  status: 'pending' | 'completed' | 'failed',
  referralId: ObjectId,
  description: String,
  createdAt: Date
}
```

### Updated Referral Schema
```typescript
{
  // ... existing fields
  status: 'pending' | 'accepted' | 'rejected' | 'interview' | 'hired' | 'completed' | 'expired',
  paymentStatus: 'held' | 'released' | 'refunded'
}
```

## API Endpoints

### Wallet Management
- `POST /api/wallet/get` - Get wallet details
- `POST /api/wallet/add-funds` - Add money to wallet
- `POST /api/wallet/hold` - Hold payment in escrow
- `POST /api/wallet/release` - Release payment to referrer
- `POST /api/wallet/refund` - Refund to seeker
- `POST /api/wallet/transactions` - Get transaction history

## Automated Refund System

### Cron Job
- Runs every hour
- Checks referrals older than 3 days with status `pending`
- Automatically refunds held payments
- Updates referral status to `expired`

## Frontend Components

### WalletPage (`/seeker/wallet`)
- Display available balance, held balance, total earned
- Add funds functionality
- Transaction history with icons and descriptions
- Real-time updates

### ReferralPayment Component
- Payment confirmation modal
- Balance check before payment
- Escrow protection details
- Redirect to add funds if insufficient balance
- Success/error handling

## Payment Split
- **Referrer**: 60% (₹59.40)
- **Platform**: 40% (₹39.60)

## Security Features
- JWT authentication on all endpoints
- Balance validation before transactions
- Atomic operations for wallet updates
- Transaction logging for transparency
- Automatic refund protection

## Usage Example

```typescript
// 1. User requests referral
<ReferralPayment 
  jobId="123" 
  referrerId="456"
  onSuccess={() => navigate('/dashboard')}
  onCancel={() => setShowModal(false)}
/>

// 2. System holds payment
await fetch('/api/wallet/hold', {
  body: JSON.stringify({ userId, referralId })
});

// 3. On completion
await fetch('/api/wallet/release', {
  body: JSON.stringify({ referralId })
});

// 4. On timeout (automatic)
// Cron job runs: checkExpiredReferrals()
```

## Transaction Transparency
Both users can view:
- Real-time balance updates
- Complete transaction history
- Payment status (held/released/refunded)
- Timestamps for all transactions
- Clear descriptions for each transaction

## Installation
```bash
cd backend
npm install node-cron @types/node-cron
```

## Environment Variables
No additional variables needed - uses existing MongoDB and JWT setup.

## Testing Flow
1. Add funds to wallet: `/seeker/wallet`
2. Request referral with payment
3. Check held balance increases
4. Wait 3 days OR complete referral
5. Verify automatic refund OR payment release
6. Check transaction history

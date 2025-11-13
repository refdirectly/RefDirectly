import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReferralPaymentProps {
  jobId: string;
  referrerId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ReferralPayment: React.FC<ReferralPaymentProps> = ({ jobId, referrerId, onSuccess, onCancel }) => {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const REFERRAL_FEE = 99;

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      const response = await fetch(`${API_URL}/api/wallet/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId, userType: 'seeker' })
      });
      
      const data = await response.json();
      if (data.success) setWallet(data.wallet);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    }
  };

  const handleDummyPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // Add dummy funds to wallet
      const addFundsResponse = await fetch(`${API_URL}/api/wallet/add-funds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          userId,
          userType: 'seeker',
          amount: REFERRAL_FEE
        })
      });

      const fundsData = await addFundsResponse.json();
      if (!fundsData.success) {
        throw new Error('Failed to add funds');
      }

      // Refresh wallet
      await fetchWallet();

      // Now process payment
      await handlePayment();
    } catch (error: any) {
      setError(error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!wallet || wallet.availableBalance < REFERRAL_FEE) {
      setError('Insufficient balance. Please add funds to your wallet.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // Create referral request
      const referralResponse = await fetch(`${API_URL}/api/referrals/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          jobId,
          seekerId: userId,
          referrerId,
          reward: REFERRAL_FEE
        })
      });

      const referralData = await referralResponse.json();
      
      if (!referralData.success) {
        throw new Error(referralData.message || 'Failed to create referral');
      }

      // Hold payment in escrow
      const paymentResponse = await fetch(`${API_URL}/api/wallet/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          userId,
          referralId: referralData.referral._id
        })
      });

      const paymentData = await paymentResponse.json();
      
      if (!paymentData.success) {
        throw new Error(paymentData.message || 'Payment failed');
      }

      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasInsufficientBalance = wallet && wallet.availableBalance < REFERRAL_FEE;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-primary text-white mb-4">
            <Wallet className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Payment</h3>
          <p className="text-gray-600">Secure your referral with escrow protection</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Referral Fee</span>
            <span className="text-2xl font-bold text-gray-900">₹{REFERRAL_FEE}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Available Balance</span>
            <span className={`text-lg font-bold ${hasInsufficientBalance ? 'text-red-600' : 'text-green-600'}`}>
              ₹{wallet?.availableBalance || 0}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="h-4 w-4" />
              <span>Payment held in escrow for 3 days</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">Payment released only when referral is completed</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">Full refund if referrer doesn't respond in 3 days</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">60% goes to referrer, 40% platform fee</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {hasInsufficientBalance ? (
            <>
              <button
                onClick={handleDummyPayment}
                disabled={loading}
                className="w-full bg-gradient-primary text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Pay ₹99 (Dummy Payment)'}
              </button>
              <button
                onClick={() => navigate('/seeker/wallet')}
                className="w-full border-2 border-brand-purple text-brand-purple py-3 rounded-xl font-bold hover:bg-brand-purple hover:text-white transition-all"
              >
                Go to Wallet
              </button>
            </>
          ) : (
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gradient-primary text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm & Pay ₹99'}
            </button>
          )}
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:border-gray-400 transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReferralPayment;

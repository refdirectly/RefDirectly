import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, CheckCircle, AlertCircle, CreditCard, Shield, QrCode, Smartphone } from 'lucide-react';

interface ReferralRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
}

const ReferralRequestModal: React.FC<ReferralRequestModalProps> = ({ isOpen, onClose, job }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'processing' | 'verify'>('details');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [qrCode, setQrCode] = useState<string>('');
  const [referralRequestId, setReferralRequestId] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');

  const handlePayment = async () => {
    setPaymentStep('processing');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};
      
      console.log('Token:', token);
      console.log('User:', user);
      console.log('Authorization header:', `Bearer ${token}`);
      
      // Check if user is logged in
      if (!token || !user.name) {
        alert('Please login to make a payment');
        window.location.href = '/auth/login';
        return;
      }
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      // Create referral request with payment
      const response = await fetch(`${API_URL}/api/referrals/with-payment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: job._id,
          company: job.company,
          role: job.title,
          amount: job.referralReward,
          message: 'Referral request for ' + job.title,
          seekerProfile: {
            name: user.name,
            email: user.email
          },
          paymentDetails: {
            method: paymentMethod,
            cardDetails: paymentMethod === 'card' ? cardDetails : null
          }
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Payment response:', data);
      
      if (data.success) {
        if (paymentMethod === 'upi' && data.qrCode) {
          setQrCode(data.qrCode);
          setReferralRequestId(data.referralRequest._id);
          setPaymentStep('verify');
        } else {
          setSuccess(true);
          setTimeout(() => {
            onClose();
            setSuccess(false);
            setPaymentStep('details');
          }, 3000);
        }
      } else {
        console.error('Payment failed:', data);
        alert('Payment failed: ' + data.message);
        setPaymentStep('payment');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Error: ' + error.message);
      setPaymentStep('payment');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToPayment = () => {
    setPaymentStep('payment');
  };

  const handleVerifyPayment = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/referrals/verify-upi`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          referralRequestId,
          transactionId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setPaymentStep('details');
          setQrCode('');
          setTransactionId('');
        }, 3000);
      } else {
        alert('Verification failed: ' + data.message);
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex h-16 w-16 rounded-full bg-green-100 items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-2">₹{job.referralReward} held in escrow</p>
                <p className="text-sm text-gray-500">Referrer will be notified. Funds released after successful referral.</p>
              </div>
            ) : paymentStep === 'details' ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex h-12 w-12 rounded-full bg-gradient-primary items-center justify-center mb-4">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Referral</h3>
                  <p className="text-gray-600">Secure payment with escrow protection</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">{job.title}</h4>
                  <p className="text-gray-600 mb-4">{job.company}</p>
                  <div className="flex items-center justify-between py-3 border-t border-gray-200">
                    <span className="text-gray-600">Referral Fee</span>
                    <span className="text-2xl font-bold text-brand-purple">₹{job.referralReward}</span>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4 mb-6 flex gap-3">
                  <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-900">
                    <p className="font-semibold mb-1">Escrow Protection</p>
                    <p>Payment held securely for 3 days. Auto-refund if referral not provided.</p>
                  </div>
                </div>

                <button
                  onClick={handleContinueToPayment}
                  className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  Continue to Payment
                </button>
              </>
            ) : paymentStep === 'payment' ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex h-12 w-12 rounded-full bg-gradient-primary items-center justify-center mb-4">
                    {paymentMethod === 'upi' ? <QrCode className="h-6 w-6 text-white" /> : <CreditCard className="h-6 w-6 text-white" />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h3>
                  <p className="text-gray-600">₹{job.referralReward} • {job.company}</p>
                </div>

                {!qrCode && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                          paymentMethod === 'card' ? 'border-brand-purple bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className="h-5 w-5" />
                        <span className="font-semibold">Card</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                          paymentMethod === 'upi' ? 'border-brand-purple bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Smartphone className="h-5 w-5" />
                        <span className="font-semibold">UPI</span>
                      </button>
                    </div>
                  </div>
                )}

                {qrCode ? (
                  <div className="text-center mb-6">
                    <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 mb-4">
                      <img src={qrCode} alt="UPI QR Code" className="w-48 h-48 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Scan QR code with any UPI app</p>
                    <div className="flex justify-center gap-2 text-xs text-gray-500">
                      <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                    </div>
                  </div>
                ) : paymentMethod === 'card' ? (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 rounded-xl p-4 mb-6 text-center">
                    <QrCode className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-900 font-semibold">UPI Payment Selected</p>
                    <p className="text-xs text-blue-700">QR code will be generated after clicking pay</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => { setPaymentStep('details'); setQrCode(''); }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Back
                  </button>
                  {!qrCode && (
                    <button
                      onClick={handlePayment}
                      disabled={loading || (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name))}
                      className="flex-2 bg-gradient-primary text-white py-3 px-6 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        `Pay ₹${job.referralReward}`
                      )}
                    </button>
                  )}
                </div>
              </>
            ) : paymentStep === 'verify' ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex h-12 w-12 rounded-full bg-gradient-primary items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Verify Payment</h3>
                  <p className="text-gray-600">Complete UPI payment and enter transaction ID</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 mb-6 text-center">
                  <img src={qrCode} alt="UPI QR Code" className="w-48 h-48 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Scan and pay ₹{job.referralReward}</p>
                  <div className="flex justify-center gap-2 text-xs text-gray-500">
                    <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
                  <input
                    type="text"
                    placeholder="Enter UPI transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                  <p className="text-xs text-gray-500 mt-1">You'll receive this after completing payment</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setPaymentStep('payment'); setQrCode(''); }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerifyPayment}
                    disabled={loading || !transactionId.trim()}
                    className="flex-2 bg-gradient-primary text-white py-3 px-6 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Verifying...
                      </>
                    ) : (
                      'Verify Payment'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex h-16 w-16 rounded-full bg-blue-100 items-center justify-center mb-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h3>
                <p className="text-gray-600">Please wait while we process your payment...</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReferralRequestModal;

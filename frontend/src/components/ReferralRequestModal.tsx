import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, CheckCircle, AlertCircle } from 'lucide-react';

interface ReferralRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
}

const ReferralRequestModal: React.FC<ReferralRequestModalProps> = ({ isOpen, onClose, job }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/referral-requests`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobPostingId: job._id })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        alert(data.message || 'Failed to send request');
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                <p className="text-gray-600">The referrer will review your request</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex h-12 w-12 rounded-full bg-gradient-primary items-center justify-center mb-4">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Referral</h3>
                  <p className="text-gray-600">Send a referral request for this job</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">{job.title}</h4>
                  <p className="text-gray-600 mb-4">{job.company}</p>
                  <div className="flex items-center justify-between py-3 border-t border-gray-200">
                    <span className="text-gray-600">Referral Fee</span>
                    <span className="text-2xl font-bold text-brand-purple">₹{job.referralReward}</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 mb-6 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    Your request will be sent to all verified referrers at {job.company}. They will be notified immediately.
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Sending Request...
                    </>
                  ) : (
                    'Send Referral Request'
                  )}
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReferralRequestModal;

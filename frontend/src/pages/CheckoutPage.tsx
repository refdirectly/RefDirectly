import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Check, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, billingCycle } = location.state || { plan: 'Starter', billingCycle: 'monthly' };

  const [loading, setLoading] = useState(false);

  const planDetails: any = {
    Starter: { 
      price: billingCycle === 'monthly' ? 199 : 1990, 
      tokens: 3 
    },
    Professional: { 
      price: billingCycle === 'monthly' ? 999 : 9990, 
      tokens: 15 
    }
  };

  const selectedPlan = planDetails[plan] || planDetails.Starter;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/subscription/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: plan.toLowerCase(),
          billingCycle,
          amount: selectedPlan.price,
          tokens: selectedPlan.tokens
        })
      });

      const data = await response.json();
      
      if (data.success) {
        navigate('/seeker/dashboard', { 
          state: { message: 'Subscription activated successfully!' } 
        });
      } else {
        alert(data.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pricing
          </button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h3 className="font-semibold text-gray-900">{plan} Plan</h3>
                    <p className="text-sm text-gray-600">
                      {billingCycle === 'monthly' ? 'Monthly' : 'Annual'} Subscription
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">₹{selectedPlan.price}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{selectedPlan.tokens} Referral Tokens</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Priority Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>No Expiry on Tokens</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Refund Guarantee</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Secure Payment</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                    />
                    <CreditCard className="absolute right-3 top-3 h-6 w-6 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand-purple to-brand-magenta text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Pay ₹${selectedPlan.price}`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;

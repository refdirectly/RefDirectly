import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Users, DollarSign, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const WalletDemoPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const simulateFlow = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const seekerId = localStorage.getItem('userId');
      const referrerId = 'dummy-referrer-id';

      // Step 1: Add funds to seeker wallet
      setMessage('Step 1: Adding ₹99 to seeker wallet...');
      await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`}/api/wallet/add-funds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId: seekerId, userType: 'seeker', amount: 99 })
      });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Simulate referral request (hold payment)
      setMessage('Step 2: Creating referral request and holding payment...');
      const simResponse = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`}/api/wallet/simulate-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ seekerId, referrerId })
      });
      const simData = await simResponse.json();
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Payment automatically released after 2 seconds
      setMessage('Step 3: Referral completed! Payment released to referrer (₹59.40)');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage('✅ Demo completed! Check your wallet to see the transactions.');
    } catch (error) {
      console.error('Demo failed:', error);
      setMessage('❌ Demo failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Wallet System Demo
              </h1>
              <p className="text-xl text-gray-600">
                Test the complete escrow payment flow with dummy money
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                { icon: DollarSign, title: 'Add Funds', desc: '₹99 to wallet', color: 'from-green-500 to-emerald-500' },
                { icon: Users, title: 'Request Referral', desc: 'Hold in escrow', color: 'from-yellow-500 to-orange-500' },
                { icon: Zap, title: 'Complete', desc: 'Auto-release', color: 'from-blue-500 to-cyan-500' },
                { icon: CheckCircle, title: 'Earn', desc: '₹59.40 to referrer', color: 'from-purple-500 to-pink-500' }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-100 text-center"
                >
                  <div className={`inline-flex h-14 w-14 rounded-xl bg-gradient-to-br ${step.color} items-center justify-center mb-4`}>
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Run Complete Flow</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Seeker adds ₹99 to wallet</p>
                    <p className="text-sm text-gray-600">Dummy payment added instantly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <CheckCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Payment held in escrow</p>
                    <p className="text-sm text-gray-600">₹99 moved to held balance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Referral completed</p>
                    <p className="text-sm text-gray-600">₹59.40 released to referrer, ₹39.60 platform fee</p>
                  </div>
                </div>
              </div>

              {message && (
                <div className="mb-6 p-4 bg-gradient-to-r from-brand-purple/10 to-brand-magenta/10 rounded-xl border-2 border-brand-purple/20">
                  <p className="text-center font-semibold text-gray-900">{message}</p>
                </div>
              )}

              <button
                onClick={simulateFlow}
                disabled={loading}
                className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Running Demo...' : 'Start Demo'}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                This will simulate the complete payment flow with dummy money
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100"
            >
              <h3 className="font-bold text-gray-900 mb-4">After Demo:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Check <strong>/seeker/wallet</strong> to see held balance and transactions</li>
                <li>• Check <strong>/referrer/wallet</strong> to see earnings (use referrer account)</li>
                <li>• All transactions are logged with timestamps</li>
                <li>• Escrow protection ensures secure payments</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WalletDemoPage;

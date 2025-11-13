import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, CheckCircle, Clock, Download, RefreshCw, ArrowUpRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface WalletData {
  availableBalance: number;
  heldBalance: number;
  totalEarned: number;
  totalSpent: number;
}

interface Transaction {
  _id: string;
  type: 'payment' | 'hold' | 'release' | 'refund' | 'earning';
  amount: number;
  description: string;
  createdAt: string;
  status: string;
}

const ReferrerWalletPage: React.FC = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('token');
      const referralsRes = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`}/api/referrals/referrer`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const referrals = await referralsRes.json();
      
      const completed = referrals.filter((r: any) => r.status === 'completed');
      const accepted = referrals.filter((r: any) => r.status === 'accepted');
      
      const totalEarned = completed.reduce((sum: number, r: any) => sum + (r.reward || 99), 0);
      const heldBalance = accepted.reduce((sum: number, r: any) => sum + (r.reward || 99), 0);
      
      setWallet({
        totalEarned,
        availableBalance: totalEarned,
        heldBalance,
        totalSpent: 0
      });
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const referralsRes = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`}/api/referrals/referrer`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const referrals = await referralsRes.json();
      
      const completed = referrals.filter((r: any) => r.status === 'completed');
      const txns = completed.map((r: any) => ({
        _id: r._id,
        type: 'earning',
        amount: r.reward || 99,
        description: `Referral completed for ${r.seekerId?.name || 'Job Seeker'} - ${r.company}`,
        createdAt: r.updatedAt || r.createdAt,
        status: 'completed'
      }));
      
      setTransactions(txns);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`}/api/wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId, amount: parseFloat(withdrawAmount) })
      });
      
      const data = await response.json();
      if (data.success) {
        setWallet(data.wallet);
        setShowWithdraw(false);
        setWithdrawAmount('');
        fetchTransactions();
        alert('Withdrawal successful!');
      } else {
        alert(data.message || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Failed to withdraw:', error);
      alert('Withdrawal failed');
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earning':
        return { icon: <TrendingUp className="h-5 w-5" />, bg: 'bg-green-100', color: 'text-green-600' };
      case 'release':
        return { icon: <CheckCircle className="h-5 w-5" />, bg: 'bg-blue-100', color: 'text-blue-600' };
      default:
        return { icon: <span className="text-lg font-bold">₹</span>, bg: 'bg-gray-100', color: 'text-gray-600' };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow pt-32 md:pt-40 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent mb-4"></div>
            <p className="text-gray-600">Loading wallet...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-2">Earnings Wallet</h1>
                  <p className="text-lg text-gray-600">Track your referral earnings and payouts</p>
                </div>
                <button
                  onClick={() => { fetchWallet(); fetchTransactions(); }}
                  className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-purple transition-all"
                >
                  <RefreshCw className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-700">Refresh</span>
                </button>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white rounded-3xl p-8 shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowWithdraw(true)}
                      className="h-10 w-10 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
                      aria-label="Withdraw funds"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-white/80 text-sm font-medium mb-2">Available Balance</p>
                  <p className="text-4xl font-bold mb-1">₹{wallet?.availableBalance || 0}</p>
                  <p className="text-white/60 text-xs">Ready to withdraw</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-gray-600 text-sm font-medium mb-2">Pending Earnings</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">₹{wallet?.heldBalance || 0}</p>
                <p className="text-gray-500 text-xs">In progress referrals</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-green-200 transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total Earned</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">₹{wallet?.totalEarned || 0}</p>
                <p className="text-gray-500 text-xs">Lifetime earnings</p>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">₹</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Referral Earnings</h3>
                </div>
                <p className="text-sm text-gray-600">Earn ₹99 for every successful referral completion.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Instant Payouts</h3>
                </div>
                <p className="text-sm text-gray-600">Earnings credited immediately when referral is marked as completed.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Easy Withdrawals</h3>
                </div>
                <p className="text-sm text-gray-600">Withdraw your earnings anytime to your bank account or UPI.</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-3xl font-bold text-gray-900">Earnings History</h2>
                <span className="text-sm text-gray-500">{transactions.length} transactions</span>
              </div>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No earnings yet</p>
                    <p className="text-sm text-gray-400 mt-1">Complete referrals to start earning</p>
                  </div>
                ) : (
                  transactions.map((tx) => {
                    const iconData = getTransactionIcon(tx.type);
                    return (
                      <div key={tx._id} className="flex items-center justify-between p-5 border-2 border-gray-100 rounded-2xl hover:border-brand-purple hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                          <div className={`h-14 w-14 rounded-xl ${iconData.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <div className={iconData.color}>{iconData.icon}</div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">{tx.description}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            +₹{Math.abs(tx.amount)}
                          </p>
                          <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 capitalize">
                            {tx.type}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 items-center justify-center mb-4">
                <ArrowUpRight className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Withdraw Funds</h3>
              <p className="text-gray-600">Transfer earnings to your bank account</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                max={wallet?.availableBalance || 0}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg font-semibold"
              />
              <p className="text-sm text-gray-500 mt-2">Available: ₹{wallet?.availableBalance || 0}</p>
              <div className="flex gap-2 mt-3">
                {[100, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setWithdrawAmount(amt.toString())}
                    disabled={(wallet?.availableBalance || 0) < amt}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold hover:border-green-500 hover:text-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ₹{amt}
                  </button>
                ))}
                <button
                  onClick={() => setWithdrawAmount((wallet?.availableBalance || 0).toString())}
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold hover:border-green-500 hover:text-green-600 transition-all"
                >
                  All
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > (wallet?.availableBalance || 0)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Withdraw ₹{withdrawAmount || 0}
              </button>
              <button
                onClick={() => { setShowWithdraw(false); setWithdrawAmount(''); }}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReferrerWalletPage;

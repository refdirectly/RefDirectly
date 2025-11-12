import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Calendar, Download, CheckCircle, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ReferrerEarningsPage: React.FC = () => {
  const [wallet, setWallet] = useState<any>({ availableBalance: 0, totalEarned: 0, heldBalance: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const referralsRes = await fetch('http://localhost:3001/api/referrals/referrer', {
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
        heldBalance
      });
      
      const txns = completed.map((r: any) => ({
        _id: r._id,
        description: `Referral for ${r.seekerId?.name || 'Job Seeker'} - ${r.company}`,
        amount: r.reward || 99,
        type: 'earning',
        createdAt: r.updatedAt || r.createdAt
      }));
      
      setTransactions(txns);
    } catch (err) {
      console.error(err);
    }
  };

  const completedTransactions = transactions.filter(t => t.type === 'earning');
  const thisMonth = new Date().getMonth();
  const thisMonthEarnings = completedTransactions
    .filter(t => new Date(t.createdAt).getMonth() === thisMonth)
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    { label: 'Total Earnings', value: `₹${wallet.totalEarned || 0}`, change: `${completedTransactions.length} paid`, icon: () => <span className="text-2xl font-bold">₹</span>, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'This Month', value: `₹${thisMonthEarnings || 0}`, change: 'Current month', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Available', value: `₹${wallet.availableBalance || 0}`, change: 'Ready to withdraw', icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Pending', value: `₹${wallet.heldBalance || 0}`, change: 'In progress', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 md:pt-40 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
                Earnings
              </h1>
              <p className="text-gray-600">Track your referral income and payment history</p>
            </div>
            <button className="flex items-center gap-2 bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105">
              <Download className="h-5 w-5" />
              Export Report
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl text-gray-300">₹</span>
                    </div>
                    <p className="text-gray-500 font-medium">No transactions yet</p>
                    <p className="text-sm text-gray-400 mt-2">Your earnings will appear here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-100">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                              <p className="font-semibold text-gray-900">{transaction.description}</p>
                            </td>
                            <td className="py-4 px-4 font-bold text-green-600">+₹{transaction.amount}</td>
                            <td className="py-4 px-4">
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 capitalize">
                                {transaction.type}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg mb-6"
              >
                <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Wallet Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Available Balance</span>
                    <span className="text-xl font-bold text-green-600">₹{wallet.availableBalance}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Pending</span>
                    <span className="text-xl font-bold text-yellow-600">₹{wallet.heldBalance}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Total Earned</span>
                    <span className="text-xl font-bold text-purple-600">₹{wallet.totalEarned}</span>
                  </div>
                  <button
                    onClick={() => navigate('/referrer/wallet')}
                    className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Go to Wallet
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal rounded-2xl p-6 text-white shadow-lg"
              >
                <TrendingUp className="h-10 w-10 mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">Earnings Stats</h3>
                <p className="text-3xl font-bold mb-2">₹{wallet.totalEarned}</p>
                <p className="text-sm opacity-90 mb-4">Total lifetime earnings</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs opacity-80 mb-1">Transactions</p>
                  <p className="text-lg font-bold">{completedTransactions.length} completed</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReferrerEarningsPage;

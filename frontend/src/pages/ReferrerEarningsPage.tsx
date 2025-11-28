import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Download, CheckCircle, Clock, DollarSign, ArrowUpRight, Filter, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  type: 'earning' | 'withdrawal';
  status: 'completed' | 'pending' | 'processing';
  createdAt: string;
  company?: string;
  role?: string;
}

interface WalletData {
  availableBalance: number;
  totalEarned: number;
  heldBalance: number;
  totalWithdrawn: number;
}

const ReferrerEarningsPage: React.FC = () => {
  const [wallet, setWallet] = useState<WalletData>({ availableBalance: 0, totalEarned: 0, heldBalance: 0, totalWithdrawn: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'earning' | 'withdrawal'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const referralsRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/referrals/referrer`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', referralsRes.status);
      console.log('Response headers:', referralsRes.headers);
      
      if (!referralsRes.ok) {
        const text = await referralsRes.text();
        console.error('Error response:', text);
        throw new Error(`Failed to fetch referrals: ${referralsRes.status}`);
      }
      
      const referrals = await referralsRes.json();
      
      console.log('All referrals:', referrals);
      console.log('Referral statuses:', referrals.map((r: any) => ({ id: r._id, status: r.status, company: r.company })));
      
      const completed = referrals.filter((r: any) => r.status === 'completed');
      const accepted = referrals.filter((r: any) => r.status === 'accepted' || r.status === 'in_progress');
      
      console.log('Completed referrals:', completed.length);
      console.log('Accepted/In-progress referrals:', accepted.length, accepted);
      
      const totalEarned = completed.reduce((sum: number, r: any) => sum + (r.reward || r.amount || 5000), 0);
      const heldBalance = accepted.reduce((sum: number, r: any) => sum + (r.reward || r.amount || 5000), 0);
      
      console.log('Total earned:', totalEarned);
      console.log('Held balance (pending):', heldBalance);
      
      setWallet({
        totalEarned,
        availableBalance: totalEarned,
        heldBalance,
        totalWithdrawn: 0
      });
      
      const completedTxns: Transaction[] = completed.map((r: any) => ({
        _id: r._id,
        description: `Referral for ${r.seekerId?.name || 'Job Seeker'}`,
        amount: r.reward || r.amount || 5000,
        type: 'earning',
        status: 'completed',
        createdAt: r.updatedAt || r.createdAt,
        company: r.company,
        role: r.role
      }));

      const pendingTxns: Transaction[] = accepted.map((r: any) => ({
        _id: r._id,
        description: `Referral for ${r.seekerId?.name || 'Job Seeker'}`,
        amount: r.reward || r.amount || 5000,
        type: 'earning',
        status: r.status === 'in_progress' ? 'processing' : 'pending',
        createdAt: r.updatedAt || r.createdAt,
        company: r.company,
        role: r.role
      }));
      
      const allTxns = [...completedTxns, ...pendingTxns];
      console.log('All transactions:', allTxns);
      setTransactions(allTxns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error('Failed to fetch earnings:', err);
      setWallet({ availableBalance: 0, totalEarned: 0, heldBalance: 0, totalWithdrawn: 0 });
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = searchTerm === '' || 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.role?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthEarnings = transactions
    .filter(t => {
      const date = new Date(t.createdAt);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear && t.type === 'earning';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthEarnings = transactions
    .filter(t => {
      const date = new Date(t.createdAt);
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear && t.type === 'earning';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const growthRate = lastMonthEarnings > 0 ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings * 100).toFixed(1) : '0';

  const stats = [
    { 
      label: 'Total Earnings', 
      value: `₹${wallet.totalEarned.toLocaleString('en-IN')}`, 
      change: `${transactions.filter(t => t.type === 'earning').length} referrals`, 
      icon: DollarSign, 
      color: 'text-green-600', 
      bg: 'bg-green-100',
      trend: '+100%'
    },
    { 
      label: 'This Month', 
      value: `₹${thisMonthEarnings.toLocaleString('en-IN')}`, 
      change: parseFloat(growthRate) >= 0 ? `+${growthRate}% from last month` : `${growthRate}% from last month`, 
      icon: TrendingUp, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100',
      trend: growthRate
    },
    { 
      label: 'Available Balance', 
      value: `₹${wallet.availableBalance.toLocaleString('en-IN')}`, 
      change: 'Ready to withdraw', 
      icon: CheckCircle, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100',
      trend: null
    },
    { 
      label: 'Pending', 
      value: `₹${wallet.heldBalance.toLocaleString('en-IN')}`, 
      change: 'In progress', 
      icon: Clock, 
      color: 'text-orange-600', 
      bg: 'bg-orange-100',
      trend: null
    },
  ];

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Company', 'Role', 'Amount', 'Type', 'Status'];
    const rows = filteredTransactions.map(t => [
      new Date(t.createdAt).toLocaleDateString('en-IN'),
      t.description,
      t.company || '-',
      t.role || '-',
      t.amount,
      t.type,
      t.status
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

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
            <button 
              onClick={exportToCSV}
              disabled={transactions.length === 0}
              className="flex items-center gap-2 bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Download className="h-5 w-5" />
              Export CSV
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  {stat.trend && (
                    <div className={`flex items-center gap-1 text-xs font-semibold ${
                      parseFloat(stat.trend) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <ArrowUpRight className={`h-3 w-3 ${
                        parseFloat(stat.trend) < 0 ? 'rotate-90' : ''
                      }`} />
                      {Math.abs(parseFloat(stat.trend))}%
                    </div>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-gray-900">Transaction History</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      />
                    </div>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      <option value="all">All Types</option>
                      <option value="earning">Earnings</option>
                      <option value="withdrawal">Withdrawals</option>
                    </select>
                  </div>
                </div>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin h-12 w-12 border-4 border-brand-purple border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading transactions...</p>
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl text-gray-300">₹</span>
                    </div>
                    <p className="text-gray-500 font-medium">
                      {searchTerm || filter !== 'all' ? 'No matching transactions' : 'No transactions yet'}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'Your earnings will appear here'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-100">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Company</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((transaction) => (
                          <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                              <p className="font-semibold text-gray-900">{transaction.description}</p>
                              {transaction.role && (
                                <p className="text-xs text-gray-500 mt-1">{transaction.role}</p>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-gray-700">{transaction.company || '-'}</p>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className={`font-bold ${
                                transaction.type === 'earning' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {transaction.type === 'earning' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {transaction.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right text-sm text-gray-600">
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
                    <span className="text-xl font-bold text-green-600">₹{wallet.availableBalance.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Pending</span>
                    <span className="text-xl font-bold text-yellow-600">₹{wallet.heldBalance.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Total Earned</span>
                    <span className="text-xl font-bold text-purple-600">₹{wallet.totalEarned.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Withdrawn</span>
                    <span className="text-xl font-bold text-blue-600">₹{wallet.totalWithdrawn.toLocaleString('en-IN')}</span>
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
                <p className="text-3xl font-bold mb-2">₹{wallet.totalEarned.toLocaleString('en-IN')}</p>
                <p className="text-sm opacity-90 mb-4">Total lifetime earnings</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mb-3">
                  <p className="text-xs opacity-80 mb-1">Completed Referrals</p>
                  <p className="text-lg font-bold">{transactions.filter(t => t.type === 'earning').length}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs opacity-80 mb-1">Avg. per Referral</p>
                  <p className="text-lg font-bold">₹{transactions.length > 0 ? Math.round(wallet.totalEarned / transactions.filter(t => t.type === 'earning').length).toLocaleString('en-IN') : 0}</p>
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

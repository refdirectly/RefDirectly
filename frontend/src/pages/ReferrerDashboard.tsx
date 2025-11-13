import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, Users, CheckCircle, Clock, TrendingUp, LogOut, Wallet } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ReferrerDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ pending: 0, completed: 0, earnings: 0, balance: 0 });
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const referralsRes = await fetch(\`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/referrals/referrer', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const referrals = await referralsRes.json();
      
      const pending = referrals.filter((r: any) => r.status === 'pending').length;
      const completed = referrals.filter((r: any) => r.status === 'completed').length;
      const accepted = referrals.filter((r: any) => r.status === 'accepted');
      
      const acceptedWithSeeker = accepted.map((ref: any) => ({
        ...ref,
        seekerName: ref.seekerId?.name || 'Job Seeker'
      }));
      
      setStats({
        pending,
        completed,
        earnings: completed * 99,
        balance: completed * 99
      });
      
      setRequests(acceptedWithSeeker.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 md:pt-40 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || 'Referrer'}!
              </h1>
              <p className="text-gray-600">Manage your referral requests and earnings</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Bell, label: 'Pending Requests', value: stats.pending.toString(), color: 'text-orange-600', bg: 'bg-orange-100' },
              { icon: CheckCircle, label: 'Completed Referrals', value: stats.completed.toString(), color: 'text-green-600', bg: 'bg-green-100' },
              { icon: () => <span className="text-2xl font-bold">₹</span>, label: 'Total Earnings', value: `₹${stats.earnings}`, color: 'text-brand-purple', bg: 'bg-purple-100' },
              { icon: Wallet, label: 'Available Balance', value: `₹${stats.balance}`, color: 'text-yellow-600', bg: 'bg-yellow-100' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-brand-purple transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-lg mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-gray-900">Active Chats</h2>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {requests.length} Active
                  </span>
                </div>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent"></div>
                  </div>
                ) : requests.length > 0 ? (
                  <div className="space-y-3">
                    {requests.map((req: any) => (
                      <div key={req._id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate('/referrer/chat?room=' + req._id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{req.seekerName}</h3>
                            <p className="text-sm text-gray-600">{req.company} - {req.role}</p>
                          </div>
                          <button className="bg-gradient-to-r from-brand-purple to-brand-magenta text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                            💬 Chat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No active chats</p>
                    <p className="text-sm text-gray-400 mt-2">Accept requests to start chatting</p>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No recent activity</p>
                  <p className="text-sm text-gray-400 mt-2">Your referral activity will appear here</p>
                </div>
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal rounded-2xl p-8 text-white shadow-lg mb-6"
              >
                <h2 className="font-display text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/referrer/requests')}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5" />
                      <span className="font-semibold">View Requests</span>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/referrer/wallet')}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5" />
                      <span className="font-semibold">My Wallet</span>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/referrer/earnings')}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold">₹</span>
                      <span className="font-semibold">Earnings</span>
                    </div>
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Getting Started</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Account created</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Wait for referral requests</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Complete referrals</span>
                  </div>
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

export default ReferrerDashboard;

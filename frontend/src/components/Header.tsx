import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, Wallet, Briefcase, FileText, ChevronDown, Bell, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2">
    <img src="/logo.png" alt="RefDirectly logo" className="h-28 w-36" />
  </Link>
);

const NavLinks = ({ className, isLoggedIn, userRole, showResumeDropdown, setShowResumeDropdown }: { className?: string; isLoggedIn: boolean; userRole?: string; showResumeDropdown?: boolean; setShowResumeDropdown?: (show: boolean) => void }) => (
  <nav className={`flex items-center gap-1 ${className}`}>
    {isLoggedIn ? (
      userRole === 'referrer' ? (
        <>
          <Link to="/referrer/dashboard" className="px-4 py-2 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-purple hover:to-brand-magenta font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">Dashboard</Link>
          <Link to="/referrer/requests" className="px-4 py-2 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-magenta hover:to-brand-teal font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">Requests</Link>
          <Link to="/referrer/earnings" className="px-4 py-2 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-teal hover:to-brand-purple font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">Earnings</Link>
          <Link to="/referrer/wallet" className="px-4 py-2 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-purple hover:to-brand-magenta font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">Wallet</Link>
          <Link to="/post-job" className="px-4 py-2 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-magenta hover:to-brand-teal font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">Post Job</Link>
        </>
      ) : (
        <>
          <Link to="/seeker/dashboard" className="px-4 py-2 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-purple hover:to-brand-magenta font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">Dashboard</Link>
          <Link to="/jobs" className="px-4 py-2 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-magenta hover:to-brand-teal font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">Jobs</Link>
          <div className="relative">
            <button
              onClick={() => setShowResumeDropdown?.(!showResumeDropdown)}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-teal hover:to-brand-purple font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Resume Tools
              <ChevronDown className="h-4 w-4" />
            </button>
            {showResumeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
              >
                <Link
                  to="/resume-builder"
                  onClick={() => setShowResumeDropdown?.(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gradient-to-r hover:from-brand-purple/10 hover:to-brand-magenta/10 transition-all"
                >
                  <FileText className="h-4 w-4 text-brand-purple" />
                  <span className="text-gray-800 font-medium">Resume Builder</span>
                </Link>
                <Link
                  to="/ats-checker"
                  onClick={() => setShowResumeDropdown?.(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gradient-to-r hover:from-brand-purple/10 hover:to-brand-magenta/10 transition-all"
                >
                  <FileText className="h-4 w-4 text-brand-magenta" />
                  <span className="text-gray-800 font-medium">ATS Checker</span>
                </Link>
              </motion.div>
            )}
          </div>
          <Link to="/ai-apply" className="px-4 py-2 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-purple hover:to-brand-teal font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">AI Apply</Link>
          <Link to="/seeker/wallet" className="px-4 py-2 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-magenta hover:to-brand-purple font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">Wallet</Link>
        </>
      )
    ) : (
      <>
        <Link to="/how-it-works" className="px-4 py-2 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-purple hover:to-brand-magenta font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">How It Works</Link>
        <Link to="/testimonials" className="px-4 py-2 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-magenta hover:to-brand-teal font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">Testimonials</Link>
        <Link to="/about" className="px-4 py-2 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-teal hover:to-brand-purple font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">About</Link>
      </>
    )}
  </nav>
);

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showResumeDropdown, setShowResumeDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleAcceptNotification = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/notifications/${notificationId}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert('Referral request accepted!');
        fetchNotifications();
      } else {
        alert(data.error || 'Failed to accept');
      }
    } catch (error) {
      console.error('Failed to accept:', error);
    }
  };

  const handleRejectNotification = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await fetch(`${API_URL}/api/notifications/${notificationId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}>
      <div className="container mx-auto px-6">
        <div className={`flex items-center justify-between rounded-2xl transition-all duration-500 relative ${isScrolled ? 'h-20 px-8' : 'h-24 px-6'}`}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-purple/20 via-brand-magenta/20 to-brand-teal/20 p-[2px]">
            <div className={`h-full w-full rounded-2xl backdrop-blur-[40px] ${isScrolled ? 'bg-white/40' : 'bg-white/35'}`}></div>
          </div>
          <div className="relative z-10 flex items-center justify-between w-full">
            <Logo />
            <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <NavLinks isLoggedIn={!!user} userRole={user?.role} showResumeDropdown={showResumeDropdown} setShowResumeDropdown={setShowResumeDropdown} />
          </div>
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200/50 transition-all duration-200 hover:shadow-md group"
                  >
                    <Bell className="h-5 w-5 text-gray-700 group-hover:text-brand-purple transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-brand-purple to-brand-magenta p-4">
                        <h3 className="text-white font-bold text-lg">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notif) => {
                            const iconMap: any = {
                              job_match: { icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
                              payment: { icon: Wallet, color: 'from-green-500 to-emerald-500' },
                              application_update: { icon: FileText, color: 'from-purple-500 to-pink-500' },
                              referral_request: { icon: User, color: 'from-orange-500 to-red-500' },
                              referral_accepted: { icon: CheckCircle, color: 'from-green-500 to-teal-500' }
                            };
                            const { icon: Icon, color } = iconMap[notif.type] || iconMap.job_match;
                            const timeAgo = new Date(notif.createdAt).toLocaleString();
                            return (
                              <div
                                key={notif._id}
                                onClick={() => markAsRead(notif._id)}
                                className={`p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer ${!notif.read ? 'bg-blue-50/50' : ''}`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`h-10 w-10 rounded-full bg-gradient-to-r ${color} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className="h-5 w-5 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                                    <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
                                    {notif.status === 'waiting' && notif.type === 'referral_request' && (
                                      <div className="flex gap-2 mt-2">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleAcceptNotification(notif._id); }}
                                          className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600"
                                        >
                                          Accept
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleRejectNotification(notif._id); }}
                                          className="text-xs bg-gray-500 text-white px-3 py-1 rounded-full hover:bg-gray-600"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  {!notif.read && <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="p-3 bg-gray-50 border-t border-gray-200">
                        <button className="text-sm font-semibold text-brand-purple hover:text-brand-magenta transition-colors w-full text-center">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200/50 transition-all duration-200 hover:shadow-md"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800">{user.name}</span>
                </button>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 overflow-hidden"
                  >
                    <Link
                      to={user.role === 'referrer' ? '/referrer/dashboard' : '/seeker/dashboard'}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-brand-purple/10 hover:to-brand-magenta/10 transition-all duration-200 group"
                    >
                      <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <LayoutDashboard className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-800 font-medium">Dashboard</span>
                    </Link>
                    <Link
                      to={user.role === 'referrer' ? '/referrer/wallet' : '/seeker/wallet'}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-purple/10 transition-all duration-200 group"
                    >
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-r from-brand-teal to-brand-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Wallet className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-800 font-medium">My Wallet</span>
                    </Link>
                    {user.role === 'referrer' && (
                      <Link
                        to="/post-job"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-brand-purple/10 hover:to-brand-magenta/10 transition-all duration-200 group"
                      >
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-r from-brand-purple to-brand-magenta flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Briefcase className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-800 font-medium">Post Job</span>
                      </Link>
                    )}
                    <hr className="my-2 border-gray-200/50" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all duration-200 w-full text-left group"
                    >
                      <div className="h-9 w-9 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="text-red-600 font-medium">Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="text-gray-700 hover:text-brand-purple font-bold transition-all duration-300 hover:scale-110 px-5 py-2.5 rounded-full hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border border-transparent hover:border-gray-200">Login</Link>
                <Link to="/referrer/join" className="relative overflow-hidden bg-gradient-primary text-white px-7 py-3 rounded-full font-bold hover:shadow-2xl hover:scale-110 transition-all duration-300 border border-white/30 group">
                  <span className="relative z-10">Become a Referrer</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-magenta to-brand-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </>
            )}
          </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-xl bg-gray-100 hover:bg-gradient-primary hover:text-white text-gray-700 transition-all duration-300 hover:scale-110">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl shadow-2xl pb-6 border-b border-gray-200/50"
        >
          <div className="container mx-auto px-6 flex flex-col items-center gap-5 pt-4">
            <NavLinks className="flex-col !gap-5" isLoggedIn={!!user} userRole={user?.role} showResumeDropdown={showResumeDropdown} setShowResumeDropdown={setShowResumeDropdown} />
            {user?.role === 'seeker' && (
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <Link to="/resume-builder" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-brand-purple font-medium transition-all duration-200 text-center">Resume Builder</Link>
                <Link to="/ats-checker" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-brand-purple font-medium transition-all duration-200 text-center">ATS Checker</Link>
              </div>
            )}
            <hr className="w-full my-2 border-gray-200"/>
            {user ? (
              <>
                <div className="text-center">
                  <p className="text-gray-700 font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Link to={user.role === 'referrer' ? '/referrer/dashboard' : '/seeker/dashboard'} onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-brand-purple font-medium transition-all duration-200">Dashboard</Link>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium transition-all duration-200">Logout</button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="text-gray-700 hover:text-brand-purple font-medium transition-all duration-200">Login</Link>
                <Link to="/referrer/join" className="bg-gradient-primary text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 w-full max-w-xs text-center">Become a Referrer</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;

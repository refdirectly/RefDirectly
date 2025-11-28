import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, Check, CheckCheck, Trash2, 
  MessageCircle, Briefcase, DollarSign, Calendar,
  UserCheck, XCircle, Wallet, Sparkles, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    
    // Setup Socket.IO for real-time notifications
    const setupSocket = async () => {
      const { io } = await import('socket.io-client');
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
        auth: { token }
      });

      socket.on('notification', (notification: any) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        showToast(notification);
      });

      return () => socket.disconnect();
    };

    setupSocket();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
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
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/notifications/read-all`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification._id);
    if (notification.link) {
      navigate(notification.link);
      setIsOpen(false);
    }
  };

  const showToast = (notification: any) => {
    // You can integrate a toast library here
    console.log('New notification:', notification.title);
  };

  const getIcon = (type: string) => {
    const icons: any = {
      referral_request: Bell,
      referral_accepted: UserCheck,
      referral_rejected: XCircle,
      referral_completed: CheckCheck,
      application_submitted: Briefcase,
      application_update: Briefcase,
      interview_scheduled: Calendar,
      payment_received: DollarSign,
      payment_pending: Wallet,
      wallet_update: Wallet,
      message_received: MessageCircle,
      chat_started: MessageCircle,
      job_match: Briefcase,
      job_alert: Briefcase,
      welcome: Sparkles,
      system: AlertCircle
    };
    return icons[type] || Bell;
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      urgent: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-blue-100 text-blue-700 border-blue-200',
      low: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` - ${unreadCount} unread` : ''}`}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 z-50 max-h-[600px] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close notifications"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    disabled={loading}
                    className="text-sm text-brand-purple hover:text-brand-magenta font-semibold transition-colors disabled:opacity-50"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Bell className="h-16 w-16 mb-4 text-gray-300" />
                    <p className="font-medium">No notifications yet</p>
                    <p className="text-sm text-gray-400 mt-1">We'll notify you when something happens</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => {
                      const Icon = getIcon(notification.type);
                      return (
                        <motion.div
                          key={notification._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              getPriorityColor(notification.priority)
                            }`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {notification.actionLabel && (
                                  <span className="text-xs font-semibold text-brand-purple">
                                    {notification.actionLabel} →
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification._id);
                              }}
                              className="p-1 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                              aria-label="Delete notification"
                            >
                              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 text-center">
                  <button
                    onClick={() => {
                      navigate('/notifications');
                      setIsOpen(false);
                    }}
                    className="text-sm text-brand-purple hover:text-brand-magenta font-semibold transition-colors"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;

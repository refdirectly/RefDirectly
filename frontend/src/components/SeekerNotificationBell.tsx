import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Notification {
  _id: string;
  type: 'referral_accepted' | 'referral_rejected' | 'interview_scheduled' | 'application_update' | 'payment_sent' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const SeekerNotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'referrals' | 'applications' | 'payments'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');
    socketRef.current.emit('join-notifications', token);

    socketRef.current.on('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      showBrowserNotification(notification);
    });

    fetchNotifications();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-notifications', token);
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showBrowserNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png'
      });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'referral_accepted': return '🎉';
      case 'referral_rejected': return '❌';
      case 'interview_scheduled': return '📅';
      case 'application_update': return '📊';
      case 'payment_sent': return '💸';
      case 'message': return '💬';
      default: return '🔔';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-blue-500';
      default: return '';
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now.getTime() - notifDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'referrals') return ['referral_accepted', 'referral_rejected'].includes(n.type);
    if (filter === 'applications') return ['interview_scheduled', 'application_update'].includes(n.type);
    if (filter === 'payments') return n.type === 'payment_sent';
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          requestNotificationPermission();
        }}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800">Job Seeker Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Mark all read
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {['all', 'referrals', 'applications', 'payments'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>No notifications yet</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <div
                  key={notification._id}
                  className={`p-4 border-b hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''} ${getPriorityColor(notification.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                        <button type="button" onClick={() => deleteNotification(notification._id)} className="text-gray-400 hover:text-red-600 flex-shrink-0" aria-label="Delete notification">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{formatTime(notification.createdAt)}</span>
                        <div className="flex gap-2">
                          {notification.link && (
                            <a href={notification.link} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                              View
                            </a>
                          )}
                          {!notification.read && (
                            <button onClick={() => markAsRead(notification._id)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerNotificationBell;

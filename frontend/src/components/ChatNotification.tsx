import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ChatNotificationProps {
  socket: any;
}

interface Notification {
  id: string;
  message: string;
  roomId: string;
}

export default function ChatNotification({ socket }: ChatNotificationProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.on('incoming_chat_message', (data: any) => {
      // Only show notification if not on chat page
      if (!window.location.pathname.includes('/chat')) {
        const notification: Notification = {
          id: Date.now().toString(),
          message: 'New message received',
          roomId: data.roomId
        };
        setNotifications(prev => [...prev, notification]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
      }
    });

    return () => {
      socket.off('incoming_chat_message');
    };
  }, [socket]);

  const handleClick = (roomId: string, notificationId: string) => {
    navigate(`/chat?room=${roomId}`);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleDismiss = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-white rounded-lg shadow-xl p-4 min-w-[300px] cursor-pointer hover:shadow-2xl transition"
            onClick={() => handleClick(notification.roomId, notification.id)}
          >
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">New Message</p>
                <p className="text-sm text-gray-600">{notification.message}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss(notification.id);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

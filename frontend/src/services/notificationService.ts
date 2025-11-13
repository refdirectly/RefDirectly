const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const notificationService = {
  getNotifications: async (page = 1, limit = 20) => {
    const response = await fetch(`${API_URL}/api/notifications?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },

  getUnreadCount: async () => {
    const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },

  markAsRead: async (notificationId: string) => {
    const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },

  markAllAsRead: async () => {
    const response = await fetch(`${API_URL}/api/notifications/mark-all-read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },

  deleteNotification: async (notificationId: string) => {
    const response = await fetch(`${API_URL}/api/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  }
};

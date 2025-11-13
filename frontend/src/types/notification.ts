export interface Notification {
  _id: string;
  userId: string;
  type: 'referral' | 'payment' | 'message' | 'application' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface UnreadCountResponse {
  count: number;
}

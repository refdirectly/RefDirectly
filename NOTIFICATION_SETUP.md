# Notification System - Quick Setup Guide

## Backend Setup

### 1. Install Dependencies (Already installed)
```bash
cd backend
npm install
```

### 2. Start Backend Server
```bash
npm run dev
```

The notification routes and socket handlers are automatically loaded.

## Frontend Setup

### 1. Create .env file
```bash
cd frontend
cp .env.example .env
```

### 2. Add NotificationBell to your Header/Navbar

```tsx
import NotificationBell from './components/NotificationBell';

function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <div>Logo</div>
      <nav className="flex items-center gap-4">
        <a href="/dashboard">Dashboard</a>
        <NotificationBell />
        <UserMenu />
      </nav>
    </header>
  );
}
```

### 3. Start Frontend
```bash
npm run dev
```

## Testing

### Test Notification Creation
```bash
curl -X POST http://localhost:3001/api/notifications/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Check Notifications
Open your app and click the bell icon. You should see the test notification.

## Integration Examples

### Send notification when referral is created
```typescript
import { notifyNewReferral } from '../utils/notificationHelper';

// In your referral controller
await notifyNewReferral(seekerId, referrerName);
```

### Send notification when payment is received
```typescript
import { notifyPaymentReceived } from '../utils/notificationHelper';

// In your payment controller
await notifyPaymentReceived(userId, amount);
```

## Features Included

✅ Real-time notifications via Socket.IO
✅ Unread count badge
✅ Mark as read (single & all)
✅ Delete notifications
✅ Responsive dropdown UI
✅ Auto-refresh on new notifications
✅ Pagination support
✅ 5 notification types (referral, payment, message, application, system)

## API Endpoints

- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `POST /api/notifications/test` - Create test notification
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Troubleshooting

### Notifications not appearing?
1. Check if backend server is running
2. Verify JWT token is valid
3. Check browser console for errors
4. Ensure Socket.IO connection is established

### Socket connection issues?
1. Check CORS settings in backend
2. Verify VITE_API_URL in frontend .env
3. Check firewall settings

## Next Steps

1. Integrate notifications into existing features (referrals, payments, chat)
2. Customize notification icons and styling
3. Add notification preferences
4. Implement email notifications for important events

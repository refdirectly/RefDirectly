# Notification System Documentation

## Overview
Professional notification bell system with real-time updates using Socket.IO and REST API.

## Features
- ✅ Real-time notifications via WebSocket
- ✅ Unread count badge
- ✅ Mark as read (individual & all)
- ✅ Delete notifications
- ✅ Notification types: referral, payment, message, application, system
- ✅ Responsive dropdown UI
- ✅ Auto-refresh on new notifications
- ✅ Time formatting (e.g., "2m ago", "3h ago")
- ✅ Click outside to close
- ✅ Pagination support

## Backend Structure

### Models
- `Notification.ts` - MongoDB schema with userId, type, title, message, read status

### Routes (`/api/notifications`)
- `GET /` - Get paginated notifications
- `GET /unread-count` - Get unread count
- `PATCH /:notificationId/read` - Mark single as read
- `PATCH /mark-all-read` - Mark all as read
- `DELETE /:notificationId` - Delete notification

### Services
- `notificationService.ts` - Create and emit notifications
- `notificationHelper.ts` - Helper functions for common notification scenarios

### Socket Events
- `join-notifications` - Join user's notification room
- `leave-notifications` - Leave notification room
- `notification` - Receive real-time notifications

## Frontend Structure

### Components
- `NotificationBell.tsx` - Main notification bell component

### Services
- `notificationService.ts` - API calls for notifications

## Usage Examples

### Backend - Send Notification

```typescript
import { sendNotification } from './utils/notificationHelper';

// Send custom notification
await sendNotification(
  userId,
  'referral',
  'New Referral',
  'You have a new referral request',
  '/referrals'
);

// Or use helper functions
import { notifyPaymentReceived } from './utils/notificationHelper';
await notifyPaymentReceived(userId, 100);
```

### Frontend - Add to Header

```tsx
import NotificationBell from './components/NotificationBell';

function Header() {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <NotificationBell />
      </nav>
    </header>
  );
}
```

## Environment Variables

Add to `.env`:
```
VITE_API_URL=http://localhost:3001
```

## Database Indexes
The Notification model includes optimized indexes:
- `userId` + `createdAt` (compound)
- `userId` (single)
- `read` (single)

## Notification Types

| Type | Icon | Use Case |
|------|------|----------|
| referral | 🤝 | New referral requests |
| payment | 💰 | Payment received/sent |
| message | 💬 | New chat messages |
| application | 📄 | Application status updates |
| system | 🔔 | System announcements |

## API Response Format

```json
{
  "notifications": [
    {
      "_id": "...",
      "userId": "...",
      "type": "payment",
      "title": "Payment Received",
      "message": "You received $100",
      "read": false,
      "link": "/wallet",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "unreadCount": 5
}
```

## Integration Points

### Referral System
```typescript
import { notifyNewReferral } from './utils/notificationHelper';
await notifyNewReferral(seekerId, referrerName);
```

### Payment System
```typescript
import { notifyPaymentReceived } from './utils/notificationHelper';
await notifyPaymentReceived(userId, amount);
```

### Chat System
```typescript
import { notifyNewMessage } from './utils/notificationHelper';
await notifyNewMessage(recipientId, senderName);
```

### Application System
```typescript
import { notifyApplicationUpdate } from './utils/notificationHelper';
await notifyApplicationUpdate(userId, 'Accepted');
```

## Security
- JWT authentication required for all endpoints
- User can only access their own notifications
- Socket rooms isolated per user
- Rate limiting applied

## Performance
- Pagination prevents large data loads
- Indexes optimize queries
- Socket.IO for efficient real-time updates
- Lazy loading of notifications

## Testing

### Test Notification Creation
```bash
curl -X POST http://localhost:3001/api/notifications/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Unread Count
```bash
curl http://localhost:3001/api/notifications/unread-count \
  -H "Authorization: Bearer YOUR_TOKEN"
```

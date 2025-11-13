# Notification System - Quick Start Guide

## ✅ What's Ready

You now have a complete role-based notification system with:
- **Job Seeker** notifications (blue theme)
- **Referrer** notifications (green theme)
- Real-time updates via Socket.IO
- Browser notifications
- Sound alerts (referrer only)
- Priority-based notifications
- Earnings tracking (referrer only)

## 🚀 Setup (2 Minutes)

### 1. Backend is Already Integrated
Just restart your backend server:
```bash
cd backend
npm run dev
```

### 2. Add to Frontend

#### For Job Seeker Pages
```tsx
import SeekerNotificationBell from './components/SeekerNotificationBell';

function SeekerDashboard() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>Job Seeker Dashboard</h1>
      <nav className="flex items-center gap-4">
        <a href="/find-referrer">Find Referrer</a>
        <a href="/applications">Applications</a>
        <SeekerNotificationBell />
      </nav>
    </header>
  );
}
```

#### For Referrer Pages
```tsx
import ReferrerNotificationBell from './components/ReferrerNotificationBell';

function ReferrerDashboard() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>Referrer Dashboard</h1>
      <nav className="flex items-center gap-4">
        <a href="/referrals">Requests</a>
        <a href="/earnings">Earnings</a>
        <ReferrerNotificationBell />
      </nav>
    </header>
  );
}
```

## 🧪 Test It Now

### Test Job Seeker Notifications
```bash
curl -X POST http://localhost:3001/api/notifications/test-seeker \
  -H "Authorization: Bearer YOUR_SEEKER_TOKEN"
```

This creates:
- ✅ Referral accepted notification
- ✅ Interview scheduled notification

### Test Referrer Notifications
```bash
curl -X POST http://localhost:3001/api/notifications/test-referrer \
  -H "Authorization: Bearer YOUR_REFERRER_TOKEN"
```

This creates:
- ✅ New referral request notification
- ✅ Payment received notification

## 📝 Send Notifications in Your Code

### When Referrer Accepts Request
```typescript
import { notifySeekerReferralAccepted } from '../utils/roleBasedNotifications';

// In your referral controller
await notifySeekerReferralAccepted(
  seekerId,
  referrerName,
  'Google',
  'Software Engineer'
);
```

### When New Referral Request Comes
```typescript
import { notifyReferrerNewRequest } from '../utils/roleBasedNotifications';

// In your referral controller
await notifyReferrerNewRequest(
  referrerId,
  seekerName,
  'Google',
  'Software Engineer',
  500 // reward amount
);
```

### When Payment is Processed
```typescript
import { 
  notifyReferrerPaymentReceived,
  notifySeekerPaymentSent 
} from '../utils/roleBasedNotifications';

// Notify referrer
await notifyReferrerPaymentReceived(
  referrerId,
  500,
  seekerName,
  'Google'
);

// Notify seeker
await notifySeekerPaymentSent(
  seekerId,
  500,
  referrerName
);
```

## 🎯 All Available Functions

### Job Seeker Notifications
```typescript
import {
  notifySeekerReferralAccepted,
  notifySeekerReferralRejected,
  notifySeekerInterviewScheduled,
  notifySeekerApplicationUpdate,
  notifySeekerPaymentSent,
  notifySeekerNewMessage
} from '../utils/roleBasedNotifications';
```

### Referrer Notifications
```typescript
import {
  notifyReferrerNewRequest,
  notifyReferrerPaymentReceived,
  notifyReferrerApplicationProgress,
  notifyReferrerNewMessage,
  notifyReferrerRatingReceived
} from '../utils/roleBasedNotifications';
```

## 🎨 Features Comparison

| Feature | Job Seeker | Referrer |
|---------|-----------|----------|
| Theme Color | Blue | Green |
| Badge Color | Red | Green |
| Filters | Referrals, Applications, Payments | Requests, Payments, Updates |
| Priority Display | Left border color | Badge labels |
| Sound Alerts | ❌ | ✅ (high priority) |
| Earnings Display | ❌ | ✅ |
| Browser Notifications | ✅ | ✅ |
| Real-time Updates | ✅ | ✅ |

## 📱 Browser Notifications

Both components automatically request permission. Users will see:
- Desktop notifications for new alerts
- Your app logo as icon
- Clickable to open the app

## 🔊 Sound Alerts (Referrer Only)

Add this file for sound alerts:
```
public/notification-high.mp3
```

Or it will silently fail (no errors).

## 🎯 Integration Checklist

- [ ] Backend server restarted
- [ ] SeekerNotificationBell added to seeker pages
- [ ] ReferrerNotificationBell added to referrer pages
- [ ] Test endpoints working
- [ ] Notifications appearing in real-time
- [ ] Browser notifications enabled
- [ ] Integrated into referral creation
- [ ] Integrated into payment processing
- [ ] Integrated into application updates

## 🐛 Troubleshooting

### Notifications not appearing?
1. Check if backend is running
2. Verify JWT token is valid
3. Check browser console for errors
4. Ensure Socket.IO connection established

### Socket connection failed?
1. Check CORS settings in backend
2. Verify VITE_API_URL in frontend .env
3. Check firewall settings

### Browser notifications not working?
1. Click the bell icon (triggers permission request)
2. Check browser notification settings
3. Ensure HTTPS in production

## 📚 Full Documentation

- `ROLE_BASED_NOTIFICATIONS.md` - Complete documentation
- `NOTIFICATION_SYSTEM.md` - Original system docs
- `NOTIFICATION_SETUP.md` - Detailed setup guide

## 🎉 You're Done!

Your notification system is production-ready with:
- ✅ Role-specific implementations
- ✅ Real-time updates
- ✅ Professional UI/UX
- ✅ Priority-based notifications
- ✅ Browser notifications
- ✅ Sound alerts
- ✅ Earnings tracking
- ✅ Complete documentation

Start sending notifications and watch them appear in real-time! 🚀

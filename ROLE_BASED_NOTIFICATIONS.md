# Role-Based Notification System

## Overview
Professional notification system with separate implementations for Job Seekers and Referrers, each with role-specific features and real-time updates.

## 🎯 Key Features

### Job Seeker Notifications
- ✅ Referral acceptance/rejection alerts
- ✅ Interview scheduling notifications
- ✅ Application status updates
- ✅ Payment tracking
- ✅ Filter by: All, Referrals, Applications, Payments
- ✅ Priority indicators (High/Medium/Low)
- ✅ Browser notifications
- ✅ Blue theme

### Referrer Notifications
- ✅ New referral request alerts
- ✅ Payment received notifications
- ✅ Application progress tracking
- ✅ Earnings dashboard in dropdown
- ✅ Filter by: All, Requests, Payments, Updates
- ✅ Urgent/Important badges
- ✅ Sound alerts for high-priority
- ✅ Green theme

## 📁 File Structure

### Backend
```
backend/src/
├── models/
│   └── Notification.ts                    # Updated with userRole & priority
├── services/
│   └── notificationService.ts             # Updated with role support
├── utils/
│   ├── roleBasedNotifications.ts          # NEW: Role-specific helpers
│   └── notificationHelper.ts              # Original helpers
```

### Frontend
```
frontend/src/components/
├── SeekerNotificationBell.tsx             # NEW: Job seeker component
├── ReferrerNotificationBell.tsx           # NEW: Referrer component
└── NotificationBell.tsx                   # Original generic component
```

## 🚀 Usage

### Backend - Send Notifications

#### For Job Seekers
```typescript
import {
  notifySeekerReferralAccepted,
  notifySeekerReferralRejected,
  notifySeekerInterviewScheduled,
  notifySeekerApplicationUpdate,
  notifySeekerPaymentSent
} from './utils/roleBasedNotifications';

// Referral accepted
await notifySeekerReferralAccepted(
  seekerId,
  'John Doe',
  'Google',
  'Software Engineer'
);

// Interview scheduled
await notifySeekerInterviewScheduled(
  seekerId,
  'Google',
  'Software Engineer',
  'Dec 25, 2024 at 10:00 AM'
);

// Application update
await notifySeekerApplicationUpdate(
  seekerId,
  'Google',
  'Software Engineer',
  'hired'
);
```

#### For Referrers
```typescript
import {
  notifyReferrerNewRequest,
  notifyReferrerPaymentReceived,
  notifyReferrerApplicationProgress,
  notifyReferrerRatingReceived
} from './utils/roleBasedNotifications';

// New referral request
await notifyReferrerNewRequest(
  referrerId,
  'Jane Smith',
  'Google',
  'Software Engineer',
  500
);

// Payment received
await notifyReferrerPaymentReceived(
  referrerId,
  500,
  'Jane Smith',
  'Google'
);

// Application progress
await notifyReferrerApplicationProgress(
  referrerId,
  'Jane Smith',
  'Google',
  'interview'
);
```

### Frontend - Add to Components

#### For Job Seeker Dashboard
```tsx
import SeekerNotificationBell from './components/SeekerNotificationBell';

function SeekerHeader() {
  return (
    <header>
      <nav>
        <a href="/find-referrer">Find Referrer</a>
        <a href="/applications">My Applications</a>
        <SeekerNotificationBell />
      </nav>
    </header>
  );
}
```

#### For Referrer Dashboard
```tsx
import ReferrerNotificationBell from './components/ReferrerNotificationBell';

function ReferrerHeader() {
  return (
    <header>
      <nav>
        <a href="/referrals">Referral Requests</a>
        <a href="/earnings">Earnings</a>
        <ReferrerNotificationBell />
      </nav>
    </header>
  );
}
```

## 📊 Notification Types

### Job Seeker Types
| Type | Icon | Priority | Use Case |
|------|------|----------|----------|
| referral_accepted | 🎉 | High | Referrer accepted request |
| referral_rejected | ❌ | Medium | Referrer declined request |
| interview_scheduled | 📅 | High | Interview date set |
| application_update | 📊 | Medium/High | Status changed |
| payment_sent | 💸 | Medium | Payment to referrer |
| message | 💬 | Medium | New chat message |

### Referrer Types
| Type | Icon | Priority | Use Case |
|------|------|----------|----------|
| referral_request | 🤝 | High | New request received |
| payment_received | 💰 | High | Earned money |
| application_update | 📊 | Medium/High | Candidate progress |
| message | 💬 | Medium | New chat message |
| system | ⭐ | Low | Ratings, announcements |

## 🎨 UI Differences

### Job Seeker Bell
- **Color**: Blue theme
- **Badge**: Red with pulse animation
- **Filters**: All, Referrals, Applications, Payments
- **Priority**: Left border color (Red/Yellow/Blue)
- **Focus**: Application tracking

### Referrer Bell
- **Color**: Green theme
- **Badge**: Green with pulse animation
- **Filters**: All, Requests, Payments, Updates
- **Priority**: Badge labels (Urgent/Important)
- **Focus**: Earnings tracking
- **Extra**: Total earnings display

## 🔔 Real-time Features

### Both Components Include:
- ✅ Socket.IO real-time updates
- ✅ Browser notifications (with permission)
- ✅ Auto-refresh on new notifications
- ✅ Click outside to close
- ✅ Mark as read (individual & all)
- ✅ Delete notifications
- ✅ Time formatting
- ✅ Direct links to relevant pages

### Referrer-Only Features:
- 🔊 Sound alerts for high-priority notifications
- 💰 Total earnings counter in header
- 🏷️ Reward amount badges on payment notifications

## 🔧 Integration Examples

### Referral Controller
```typescript
import { notifyReferrerNewRequest, notifySeekerReferralAccepted } from '../utils/roleBasedNotifications';

export const createReferral = async (req, res) => {
  const { seekerId, referrerId, company, role, reward } = req.body;
  
  // Create referral in database
  const referral = await Referral.create({ /* ... */ });
  
  // Notify referrer
  await notifyReferrerNewRequest(
    referrerId,
    req.user.name,
    company,
    role,
    reward
  );
  
  res.json({ success: true, referral });
};

export const acceptReferral = async (req, res) => {
  const { referralId } = req.params;
  const referral = await Referral.findById(referralId);
  
  // Update status
  referral.status = 'accepted';
  await referral.save();
  
  // Notify seeker
  await notifySeekerReferralAccepted(
    referral.seekerId,
    req.user.name,
    referral.company,
    referral.role
  );
  
  res.json({ success: true });
};
```

### Payment Controller
```typescript
import { notifyReferrerPaymentReceived, notifySeekerPaymentSent } from '../utils/roleBasedNotifications';

export const processPayment = async (req, res) => {
  const { referralId, amount } = req.body;
  const referral = await Referral.findById(referralId).populate('seekerId referrerId');
  
  // Process payment
  await Payment.create({ /* ... */ });
  
  // Notify both parties
  await notifyReferrerPaymentReceived(
    referral.referrerId._id,
    amount,
    referral.seekerId.name,
    referral.company
  );
  
  await notifySeekerPaymentSent(
    referral.seekerId._id,
    amount,
    referral.referrerId.name
  );
  
  res.json({ success: true });
};
```

## 🧪 Testing

### Test Seeker Notifications
```bash
# Create test notification for seeker
curl -X POST http://localhost:3001/api/notifications/test-seeker \
  -H "Authorization: Bearer SEEKER_TOKEN"
```

### Test Referrer Notifications
```bash
# Create test notification for referrer
curl -X POST http://localhost:3001/api/notifications/test-referrer \
  -H "Authorization: Bearer REFERRER_TOKEN"
```

## 📱 Browser Notifications

Both components request browser notification permission on first click. Users will see:
- Desktop notifications for new alerts
- Custom icon (your logo)
- Clickable to open the app

## 🎵 Sound Alerts (Referrer Only)

High-priority notifications play a sound. Add this file:
```
public/notification-high.mp3
```

## 🔒 Security

- JWT authentication required
- Users only see their own notifications
- Role-based filtering at database level
- Socket rooms isolated per user

## 📈 Performance

- Optimized database queries with compound indexes
- Pagination support (20 per page)
- Real-time updates without polling
- Efficient socket.io rooms

## 🎯 Next Steps

1. Add notification preferences (email, push, in-app)
2. Implement notification history page
3. Add notification sound customization
4. Create notification analytics dashboard
5. Add bulk actions (delete all read)

## 📝 Summary

You now have:
- ✅ 2 role-specific notification components
- ✅ 12+ notification helper functions
- ✅ Priority-based notifications
- ✅ Real-time updates via Socket.IO
- ✅ Browser notifications
- ✅ Sound alerts (referrer)
- ✅ Earnings tracking (referrer)
- ✅ Filter capabilities
- ✅ Professional UI/UX
- ✅ Production-ready code

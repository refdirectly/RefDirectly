# Chat System Documentation

## Overview
Professional real-time chat system enabling job seekers and referrers to communicate after a referral request is accepted.

## Features

### 🎨 Modern UI/UX
- Clean, professional interface with gradient accents
- Smooth animations using Framer Motion
- Responsive design for all screen sizes
- Message bubbles with timestamps
- Typing indicators
- Online/offline status

### 🔒 Security & Privacy
- Anonymous chat by default
- User authentication required
- Participant verification
- Secure WebSocket connections

### ⚡ Real-time Features
- Instant message delivery via Socket.IO
- Typing indicators
- Online presence detection
- Message read receipts (ready for implementation)
- Push notifications for new messages

### 📱 User Experience
- Chat list sidebar showing all conversations
- Last message preview
- Status badges (accepted, in_progress, etc.)
- Empty state designs
- Smooth scrolling to latest messages

## Architecture

### Backend Components

#### Models
- **ChatRoom** (`/backend/src/models/ChatRoom.ts`)
  - Stores chat metadata and messages
  - Links to referral requests
  - Manages participants

#### Controllers
- **chatController** (`/backend/src/controllers/chatController.ts`)
  - `getChatRoom`: Fetch chat history
  - `getUserChats`: Get all user conversations

#### Routes
- **chat routes** (`/backend/src/routes/chat.ts`)
  - `GET /api/chat/chats` - List all user chats
  - `GET /api/chat/:roomId` - Get specific chat room

#### Socket Events
- **referral.ts** (`/backend/src/sockets/referral.ts`)
  - `join_chat_room` - Join a chat room
  - `chat_message` - Send a message
  - `incoming_chat_message` - Receive messages
  - `typing` - Typing indicator

### Frontend Components

#### Pages
- **ChatPage** (`/frontend/src/pages/ChatPage.tsx`)
  - Main chat interface
  - Sidebar with conversation list
  - Chat selection and display

#### Components
- **ChatInterface** (`/frontend/src/components/ChatInterface.tsx`)
  - Message display
  - Input field with send button
  - Typing indicators
  - Real-time updates

- **ChatNotification** (`/frontend/src/components/ChatNotification.tsx`)
  - Toast notifications for new messages
  - Click to navigate to chat
  - Auto-dismiss after 5 seconds

## Usage Flow

### 1. Referral Request Accepted
```typescript
// When referrer accepts request
socket.emit('referral_request_accept', {
  requestId: 'xxx',
  referrerId: 'yyy'
});

// System creates chat room automatically
// Both parties receive chat room ID
```

### 2. Accessing Chat
```typescript
// Navigate to /chat
// View all conversations in sidebar
// Click to open specific chat
```

### 3. Sending Messages
```typescript
// User types and sends message
socket.emit('chat_message', {
  roomId: 'xxx',
  text: 'Hello!',
  senderRole: 'seeker' // or 'referrer'
});

// Other participant receives instantly
socket.on('incoming_chat_message', (message) => {
  // Display message in UI
});
```

### 4. Typing Indicators
```typescript
// When user types
socket.emit('typing', {
  roomId: 'xxx',
  isTyping: true
});

// Other participant sees "typing..." indicator
socket.on('typing', ({ isTyping }) => {
  // Show/hide typing indicator
});
```

## Installation

### Backend Dependencies
Already included in package.json:
- socket.io
- express
- mongoose

### Frontend Dependencies
```bash
cd frontend
npm install socket.io-client
```

## Configuration

### Environment Variables
```env
# Backend (.env)
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/refferai

# Frontend (.env)
VITE_API_URL=http://localhost:5000
```

## API Endpoints

### REST API

#### Get User Chats
```http
GET /api/chat/chats
Authorization: Required
Response: {
  chats: [{
    _id: string,
    referralRequest: { company, role, status },
    userRole: 'seeker' | 'referrer',
    lastMessage: { text, createdAt },
    unreadCount: number
  }]
}
```

#### Get Chat Room
```http
GET /api/chat/:roomId
Authorization: Required
Response: {
  messages: [{
    senderRole: 'seeker' | 'referrer' | 'system',
    text: string,
    createdAt: Date
  }]
}
```

### WebSocket Events

#### Client → Server
- `join_chat_room(roomId)` - Join a chat room
- `chat_message({ roomId, text, senderRole })` - Send message
- `typing({ roomId, isTyping })` - Typing indicator

#### Server → Client
- `incoming_chat_message(message)` - New message received
- `typing({ isTyping })` - Other user typing status

## Future Enhancements

### Planned Features
- [ ] File/image sharing
- [ ] Voice messages
- [ ] Video calls
- [ ] Message reactions
- [ ] Read receipts
- [ ] Message search
- [ ] Chat export
- [ ] Block/report users
- [ ] Message encryption
- [ ] Offline message queue

### Performance Optimizations
- [ ] Message pagination
- [ ] Virtual scrolling for large chats
- [ ] Message caching
- [ ] Lazy loading of media
- [ ] WebSocket connection pooling

## Troubleshooting

### Common Issues

**Messages not sending**
- Check WebSocket connection status
- Verify user authentication
- Check network connectivity

**Typing indicator stuck**
- Timeout is set to 3 seconds
- Check socket event listeners

**Chat not loading**
- Verify roomId is correct
- Check user is participant
- Review server logs

## Security Considerations

1. **Authentication**: All chat endpoints require authentication
2. **Authorization**: Users can only access chats they're part of
3. **Input Validation**: All messages are sanitized
4. **Rate Limiting**: Prevent spam and abuse
5. **Anonymous Mode**: Protects user privacy initially

## Testing

### Manual Testing
1. Create two user accounts (seeker and referrer)
2. Create and accept a referral request
3. Navigate to /chat on both accounts
4. Send messages and verify real-time delivery
5. Test typing indicators
6. Test notifications

### Automated Testing (TODO)
- Unit tests for controllers
- Integration tests for socket events
- E2E tests for chat flow

## Support

For issues or questions:
1. Check server logs: `backend/server.log`
2. Check browser console for errors
3. Verify WebSocket connection in Network tab
4. Review this documentation

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintainer**: ReferAI Team

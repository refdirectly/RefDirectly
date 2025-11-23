import { Server, Socket } from 'socket.io';
import ReferralRequest from '../models/ReferralRequest';
import ChatRoom from '../models/ChatRoom';
import User from '../models/User';

const locks = new Map<string, string>();

export function createReferralHandler(io: Server, socket: Socket) {
  
  // Join company rooms for referrers
  socket.on('join_company_room', async (data: { companies: string[] }) => {
    data.companies.forEach(company => {
      const roomName = `company:${company.toLowerCase()}`;
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined room ${roomName}`);
    });
  });

  // Create referral request (after payment confirmation)
  socket.on('create_referral_request', async (data: {
    company: string;
    role: string;
    skills: string[];
    description: string;
    reward: number;
    seekerId: string;
    paymentId: string;
  }) => {
    try {
      const request = await ReferralRequest.create({
        ...data,
        status: 'pending',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });

      const companyRoom = `company:${data.company.toLowerCase()}`;
      
      // Broadcast to eligible referrers in company room
      io.to(companyRoom).emit('referral_request_received', {
        requestId: request._id,
        company: data.company,
        role: data.role,
        skills: data.skills,
        reward: data.reward,
        timeLimit: request.expiresAt
      });

      socket.emit('referral_request_created', {
        requestId: request._id,
        status: 'pending'
      });

    } catch (error) {
      console.error('Error creating referral request:', error);
      socket.emit('error', { message: 'Failed to create referral request' });
    }
  });

  // Accept referral request with race condition handling
  socket.on('referral_request_accept', async (data: {
    requestId: string;
    referrerId: string;
  }) => {
    const { requestId, referrerId } = data;
    const lockKey = `lock:referral:${requestId}`;

    try {
      // Simple lock to prevent race conditions
      const gotLock = !locks.has(lockKey);
      if (gotLock) locks.set(lockKey, referrerId);
      
      if (!gotLock) {
        socket.emit('referral_request_closed', { 
          requestId, 
          reason: 'Already accepted by another referrer' 
        });
        return;
      }
      setTimeout(() => locks.delete(lockKey), 10000);

      // Double-check request status
      const request = await ReferralRequest.findById(requestId);
      if (!request || request.status !== 'pending') {
        locks.delete(lockKey);
        socket.emit('referral_request_closed', { 
          requestId, 
          reason: 'Request no longer available' 
        });
        return;
      }

      // Get referrer info for anonymous display
      const referrer = await User.findById(referrerId);
      if (!referrer || !referrer.verified) {
        locks.delete(lockKey);
        socket.emit('error', { message: 'Referrer not verified' });
        return;
      }

      // Update request status
      request.status = 'accepted';
      request.acceptedBy = referrerId as any;
      request.acceptedAt = new Date();
      await request.save();

      // Create anonymous chat room
      const chatRoom = await ChatRoom.create({
        referralRequestId: request._id,
        participants: [
          { userId: request.seekerId, role: 'seeker' },
          { userId: referrerId, role: 'referrer' }
        ],
        anonymous: true,
        messages: [{
          senderRole: 'system',
          text: 'Chat started. You can now discuss the referral details.',
          createdAt: new Date()
        }]
      });

      request.chatRoomId = chatRoom._id as any;
      await request.save();

      // Notify seeker
      const seekerSocket = await findSocketByUserId(io, request.seekerId.toString());
      if (seekerSocket) {
        seekerSocket.emit('referral_request_confirmed', {
          requestId: request._id,
          chatRoomId: chatRoom._id,
          referrerDisplay: {
            experience: referrer.companies.length,
            anonId: `REF_${referrerId.slice(-4)}`
          }
        });
      }

      // Notify referrer
      socket.emit('referral_request_confirmed', {
        requestId: request._id,
        chatRoomId: chatRoom._id
      });

      // Close request for other referrers
      const companyRoom = `company:${request.company.toLowerCase()}`;
      socket.to(companyRoom).emit('referral_request_closed', {
        requestId,
        reason: 'Accepted by another referrer'
      });

      locks.delete(lockKey);

    } catch (error) {
      console.error('Error accepting referral request:', error);
      locks.delete(lockKey);
      socket.emit('error', { message: 'Failed to accept referral request' });
    }
  });

  // Chat message handling
  socket.on('chat_message', async (data: {
    roomId: string;
    text: string;
    senderRole: 'seeker' | 'referrer';
  }) => {
    try {
      console.log(`📨 Received chat_message for room ${data.roomId}:`, data.text.substring(0, 50));
      
      const message = {
        senderRole: data.senderRole,
        text: data.text,
        createdAt: new Date()
      };

      // Save to database
      const chatRoom = await ChatRoom.findById(data.roomId);
      if (chatRoom) {
        chatRoom.messages.push(message as any);
        await chatRoom.save();
        console.log(`💾 Message saved to database`);
      }

      // Broadcast to ALL participants in the room (including sender)
      console.log(`📡 Broadcasting to room ${data.roomId}`);
      io.to(data.roomId).emit('incoming_chat_message', message);
      
      // Also emit to sender's socket directly as backup
      socket.emit('incoming_chat_message', message);
      
      console.log(`✅ Message broadcast complete`);

    } catch (error) {
      console.error('❌ Error sending chat message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Join chat room
  socket.on('join_chat_room', (roomId: string) => {
    socket.join(roomId);
    console.log(`✅ Socket ${socket.id} joined chat room ${roomId}`);
    
    // Get room info
    const room = io.sockets.adapter.rooms.get(roomId);
    console.log(`👥 Room ${roomId} now has ${room?.size || 0} participants`);
  });

  // Typing indicator
  socket.on('typing', (data: { roomId: string; isTyping: boolean }) => {
    socket.to(data.roomId).emit('typing', data);
  });
}

// Helper function to find socket by user ID
async function findSocketByUserId(io: Server, userId: string) {
  const sockets = await io.fetchSockets();
  const found = sockets.find(s => (s as any).userId === userId);
  return found as any;
}
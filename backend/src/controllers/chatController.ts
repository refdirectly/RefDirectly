import { Request, Response } from 'express';
import ChatRoom from '../models/ChatRoom';
import Referral from '../models/Referral';

export const getChatRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    let chatRoom = await ChatRoom.findById(roomId);
    
    if (!chatRoom) {
      const referral = await Referral.findById(roomId);
      if (!referral || referral.status !== 'accepted') {
        return res.status(404).json({ messages: [] });
      }
      
      chatRoom = new ChatRoom({
        _id: roomId,
        referralRequestId: roomId,
        participants: [
          { userId: referral.seekerId, role: 'seeker' },
          { userId: referral.referrerId, role: 'referrer' }
        ],
        messages: []
      });
      await chatRoom.save();
    }

    res.json({ messages: chatRoom.messages || [] });
  } catch (error) {
    console.error('Error fetching chat room:', error);
    res.status(500).json({ messages: [] });
  }
};

export const getUserChats = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?._id;

    // Find all accepted referrals for this user
    const referrals = await Referral.find({
      $or: [
        { seekerId: userId },
        { referrerId: userId }
      ],
      status: 'accepted'
    }).sort({ createdAt: -1 });

    const chatsWithDetails = referrals.map(ref => {
      const userRole = ref.seekerId.toString() === userId.toString() ? 'seeker' : 'referrer';

      return {
        _id: ref._id,
        referralRequest: {
          _id: ref._id,
          company: ref.company,
          role: ref.role,
          status: ref.status
        },
        userRole,
        lastMessage: null,
        unreadCount: 0
      };
    });

    res.json({ chats: chatsWithDetails });
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { text, senderRole } = req.body;

    console.log(`💾 Saving message to room ${roomId}`);

    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }

    const message = {
      senderRole,
      text,
      createdAt: new Date(),
      read: false
    };

    chatRoom.messages.push(message as any);
    await chatRoom.save();

    console.log(`✅ Message saved successfully`);
    res.json({ success: true, message });
  } catch (error) {
    console.error('❌ Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
};

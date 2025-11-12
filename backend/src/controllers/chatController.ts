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

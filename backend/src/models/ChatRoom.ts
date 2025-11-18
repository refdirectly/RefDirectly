import mongoose, { Document, Schema } from 'mongoose';

export interface IChatRoom extends Document {
  referralRequestId: mongoose.Types.ObjectId;
  participants: Array<{
    userId: mongoose.Types.ObjectId;
    role: 'seeker' | 'referrer';
  }>;
  anonymous: boolean;
  messages: Array<{
    senderRole: 'seeker' | 'referrer' | 'system';
    text: string;
    createdAt: Date;
  }>;
  createdAt: Date;
}

const ChatRoomSchema = new Schema<IChatRoom>({
  referralRequestId: {
    type: Schema.Types.ObjectId,
    ref: 'Referral',
    required: true
  },
  participants: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['seeker', 'referrer'],
      required: true
    }
  }],
  anonymous: {
    type: Boolean,
    default: true
  },
  messages: [{
    senderRole: {
      type: String,
      enum: ['seeker', 'referrer', 'system'],
      required: true
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);
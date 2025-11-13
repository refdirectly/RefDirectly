import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export const createNotificationHandler = (io: Server, socket: Socket) => {
  socket.on('join-notifications', (token: string) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      socket.join(`user:${decoded.id}`);
      console.log(`User ${decoded.id} joined notifications`);
    } catch (error) {
      console.error('Invalid token for notifications:', error);
    }
  });

  socket.on('leave-notifications', (token: string) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      socket.leave(`user:${decoded.id}`);
    } catch (error) {
      console.error('Invalid token:', error);
    }
  });
};

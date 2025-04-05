import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { ChatMessage } from '../../types';

export const setupSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('leave_room', (roomId: string) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on('send_message', (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      io.to(message.topic).emit('new_message', {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date(),
      });
    });

    socket.on('typing', ({ roomId, username }: { roomId: string; username: string }) => {
      socket.to(roomId).emit('user_typing', { username, roomId });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};
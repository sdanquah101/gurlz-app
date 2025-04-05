import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from '../utils/jwt';
import { logger } from '../utils/logger';

export const setupSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = await verifyToken(token);
      socket.data.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.data.userId}`);

    // Join personal room
    socket.join(`user:${socket.data.userId}`);

    // Handle chat messages
    socket.on('send_message', async (data) => {
      try {
        // Broadcast to room
        io.to(data.topic).emit('new_message', {
          ...data,
          id: Date.now().toString(),
          timestamp: new Date()
        });
      } catch (error) {
        logger.error('Error sending message:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.to(data.topic).emit('user_typing', {
        userId: socket.data.userId,
        topic: data.topic
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.data.userId}`);
    });
  });

  return io;
};
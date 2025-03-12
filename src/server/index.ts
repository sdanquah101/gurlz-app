import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { setupSocket } from './config/socket';
import { errorHandler, notFound } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import fashionRoutes from './routes/fashion';
import mentalRoutes from './routes/mental';
import physicalRoutes from './routes/physical';
import reproductiveRoutes from './routes/reproductive';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// Setup Socket.IO
setupSocket(httpServer);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/fashion', fashionRoutes);
app.use('/api/mental', mentalRoutes);
app.use('/api/physical', physicalRoutes);
app.use('/api/reproductive', reproductiveRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
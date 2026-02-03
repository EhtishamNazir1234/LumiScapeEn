import http from 'http';
import express from 'express';
import { Server as SocketServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import jwt from 'jsonwebtoken';
import User from './models/User.model.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import deviceRoutes from './routes/device.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import roleRoutes from './routes/role.routes.js';
import chatRoutes from './routes/chat.routes.js';
import reportRoutes from './routes/report.routes.js';
import tariffRoutes from './routes/tariff.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import enterpriseRoutes from './routes/enterprise.routes.js';
import helpCenterRoutes from './routes/helpCenter.routes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware (increase limit for base64 profile images)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lumiscape', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/tariff', tariffRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/enterprise', enterpriseRoutes);
app.use('/api/help-center', helpCenterRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.io for realtime chat
const io = new SocketServer(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }
});
app.set('io', io);

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production');
    const user = await User.findById(decoded.id).select('_id name email');
    if (!user) return next(new Error('User not found'));
    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// Track online users for presence (active/inactive)
const onlineUserIds = new Set();

io.on('connection', (socket) => {
  const userId = socket.userId;
  if (userId) {
    onlineUserIds.add(userId);
    socket.broadcast.emit('user_online', { userId });
    socket.emit('online_users', Array.from(onlineUserIds));
  }

  socket.on('join_chat', (chatId) => {
    const room = `chat:${String(chatId)}`;
    socket.join(room);
  });
  socket.on('leave_chat', (chatId) => {
    socket.leave(`chat:${String(chatId)}`);
  });

  socket.on('typing_start', (data) => {
    const chatId = data?.chatId ? String(data.chatId) : null;
    if (chatId) {
      socket.to(`chat:${chatId}`).emit('user_typing', {
        chatId,
        userId: userId,
        userName: socket.user?.name,
      });
    }
  });
  socket.on('typing_stop', (data) => {
    const chatId = data?.chatId ? String(data.chatId) : null;
    if (chatId) {
      socket.to(`chat:${chatId}`).emit('user_stopped_typing', {
        chatId,
        userId: userId,
      });
    }
  });

  socket.on('disconnect', () => {
    if (userId) {
      onlineUserIds.delete(userId);
      socket.broadcast.emit('user_offline', { userId });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
export { io };

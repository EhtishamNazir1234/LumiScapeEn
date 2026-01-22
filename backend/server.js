import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

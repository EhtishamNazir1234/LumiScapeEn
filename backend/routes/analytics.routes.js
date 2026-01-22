import express from 'express';
import Device from '../models/Device.model.js';
import Ticket from '../models/Ticket.model.js';
import Subscription from '../models/Subscription.model.js';
import User from '../models/User.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private (Admin/Super-admin)
router.get('/dashboard', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    // Device stats
    const totalDevices = await Device.countDocuments();
    const onlineDevices = await Device.countDocuments({ status: 'Online' });
    const offlineDevices = await Device.countDocuments({ status: 'Offline' });

    // Ticket stats
    const totalTickets = await Ticket.countDocuments();
    const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
    const pendingTickets = await Ticket.countDocuments({ 
      status: { $in: ['New', 'Pending', 'In Progress', 'Unresolved'] } 
    });

    // User stats
    const totalUsers = await User.countDocuments({ status: { $ne: 'Archived' } });
    const activeUsers = await User.countDocuments({ status: 'Active' });

    // Subscription stats
    const activeSubscriptions = await Subscription.countDocuments({ status: 'Active' });
    const expiredSubscriptions = await Subscription.countDocuments({ status: 'Expired' });

    // Device category breakdown
    const deviceCategories = await Device.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      devices: {
        total: totalDevices,
        online: onlineDevices,
        offline: offlineDevices
      },
      tickets: {
        total: totalTickets,
        resolved: resolvedTickets,
        pending: pendingTickets
      },
      users: {
        total: totalUsers,
        active: activeUsers
      },
      subscriptions: {
        active: activeSubscriptions,
        expired: expiredSubscriptions
      },
      deviceCategories
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/system
// @desc    Get system analytics
// @access  Private (Admin/Super-admin)
router.get('/system', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    // Device usage analytics
    const deviceUsage = await Device.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          onlineCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Online'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // User role distribution
    const userRoles = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Ticket type distribution
    const ticketTypes = await Ticket.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      deviceUsage,
      userRoles,
      ticketTypes
    });
  } catch (error) {
    console.error('Get system analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

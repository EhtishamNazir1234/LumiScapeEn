import express from 'express';
import Device from '../models/Device.model.js';
import User from '../models/User.model.js';
import Subscription from '../models/Subscription.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/enterprise/dashboard
// @desc    Get enterprise dashboard data
// @access  Private (Enterprise role)
router.get('/dashboard', async (req, res) => {
  try {
    // Energy consumption stats (mock data structure)
    const energyStats = {
      consumption: '220 kWh',
      cost: '₦3500',
      peakHours: '6-10pm'
    };

    // Device locations breakdown
    const locations = await Device.aggregate([
      {
        $match: {
          'location.building': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          buildings: { $addToSet: '$location.building' },
          floors: { $addToSet: '$location.floor' },
          rooms: { $addToSet: '$location.room' },
          zones: { $addToSet: '$location.zone' }
        }
      }
    ]);

    const locationData = locations[0] || { buildings: [], floors: [], rooms: [], zones: [] };

    // Consuming devices (mock structure - in production, calculate from actual energy data)
    const consumingDevices = await Device.find({ 'energyConsumption.currentUsage': { $gt: 0 } })
      .limit(10)
      .select('name energyConsumption')
      .lean();

    // Device status summary
    const deviceStatus = await Device.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      energyStats,
      locations: {
        buildings: locationData.buildings.length,
        floors: locationData.floors.length,
        rooms: locationData.rooms.length,
        zones: locationData.zones.length
      },
      consumingDevices,
      deviceStatus
    });
  } catch (error) {
    console.error('Get enterprise dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/enterprise/energy
// @desc    Get energy consumption data
// @access  Private (Enterprise role)
router.get('/energy', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // In production, this would query actual energy consumption records
    // For now, return mock structure
    const energyData = {
      totalConsumption: 220,
      totalCost: 3500,
      peakHours: ['18:00', '19:00', '20:00', '21:00', '22:00'],
      dailyBreakdown: []
    };

    res.json(energyData);
  } catch (error) {
    console.error('Get energy data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

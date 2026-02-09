import express from 'express';
import { body, validationResult } from 'express-validator';
import Device from '../models/Device.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/devices
// @desc    Get all devices
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { serial: { $regex: search, $options: 'i' } },
        { deviceId: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const devices = await Device.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Device.countDocuments(query);
    
    res.json({
      devices,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/devices/stats/overview (must be before /:id)
// @desc    Get device statistics
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const totalDevices = await Device.countDocuments();
    const onlineDevices = await Device.countDocuments({ status: 'Online' });
    const offlineDevices = await Device.countDocuments({ status: 'Offline' });
    const maintenanceDevices = await Device.countDocuments({ status: 'Maintenance' });

    const categoryStats = await Device.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalDevices,
      onlineDevices,
      offlineDevices,
      maintenanceDevices,
      categoryStats
    });
  } catch (error) {
    console.error('Get device stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/devices/:id
// @desc    Get single device
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)
      .populate('assignedTo', 'name email userId');
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(device);
  } catch (error) {
    console.error('Get device error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/devices
// @desc    Create new device
// @access  Private
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('serial').trim().notEmpty().withMessage('Serial is required'),
  body('category').isIn(['Switch', 'Sensor', 'Energy', 'Lighting', 'Other']).withMessage('Invalid category'),
  body('type').trim().notEmpty().withMessage('Type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, serial, category, type, variant, location, assignedTo } = req.body;

    const deviceExists = await Device.findOne({ serial });
    if (deviceExists) {
      return res.status(400).json({ message: 'Device with this serial already exists' });
    }

    const device = await Device.create({
      name,
      serial,
      category,
      type,
      variant: variant || '',
      location: location || {},
      assignedTo: assignedTo || null
    });

    const populatedDevice = await Device.findById(device._id)
      .populate('assignedTo', 'name email');
    
    res.status(201).json(populatedDevice);
  } catch (error) {
    console.error('Create device error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/devices/:id
// @desc    Update device
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(device);
  } catch (error) {
    console.error('Update device error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/devices/:id
// @desc    Delete device
// @access  Private (Admin/Super-admin)
router.delete('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'super-admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete devices' });
    }

    const device = await Device.findByIdAndDelete(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

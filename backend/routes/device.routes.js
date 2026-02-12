import express from 'express';
import { body, validationResult } from 'express-validator';
import Device from '../models/Device.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// Helper to compute live consumption for virtual controllable devices
const computeLiveConsumption = (device) => {
  if (!device) return null;
  const powerRatingW = device.powerRatingW || 0;
  const baseTotalWh = device.energyConsumption?.totalUsage || 0;
  const now = new Date();

  let extraWh = 0;
  if (device.isOn && device.lastPowerOnAt) {
    const elapsedMs = now.getTime() - new Date(device.lastPowerOnAt).getTime();
    const hours = elapsedMs / (1000 * 60 * 60);
    extraWh = hours * powerRatingW;
  }

  const totalWh = baseTotalWh + extraWh;
  const pricePerKwh = 0.2; // simple flat rate for demo
  const cost = (totalWh / 1000) * pricePerKwh;

  return {
    currentWatts: device.isOn ? powerRatingW : 0,
    totalWh,
    totalKwh: totalWh / 1000,
    cost,
  };
};

// @route   POST /api/devices/register-phone
// @desc    Register the current user's mobile phone as a virtual device
// @access  Private (any authenticated user)
router.post('/register-phone', async (req, res) => {
  try {
    const existing = await Device.findOne({
      assignedTo: req.user._id,
      type: 'Mobile Phone',
    });

    if (existing) {
      return res.json(existing);
    }

    const name = req.body.name?.trim() || 'My Phone';
    const powerRatingW = typeof req.body.powerRatingW === 'number'
      ? req.body.powerRatingW
      : 15;

    const serial = `PHONE-${req.user._id}-${Date.now()}`;

    const device = await Device.create({
      name,
      serial,
      category: 'Other',
      type: 'Mobile Phone',
      variant: 'Personal Device',
      assignedTo: req.user._id,
      energyConsumption: {
        currentUsage: 0,
        totalUsage: 0,
        cost: 0,
      },
      isOn: false,
      powerRatingW,
      lastPowerOnAt: null,
    });

    const populated = await Device.findById(device._id)
      .populate('assignedTo', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Register phone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/devices/my-phone
// @desc    Get the current user's registered phone device with live consumption
// @access  Private
router.get('/my-phone', async (req, res) => {
  try {
    const device = await Device.findOne({
      assignedTo: req.user._id,
      type: 'Mobile Phone',
    }).populate('assignedTo', 'name email userId');

    if (!device) {
      return res.status(404).json({ message: 'Phone device not registered' });
    }

    const liveConsumption = computeLiveConsumption(device);

    res.json({
      ...device.toObject(),
      liveConsumption,
    });
  } catch (error) {
    console.error('Get my phone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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

// @route   PATCH /api/devices/:id/toggle-power
// @desc    Toggle power state for a device (e.g., registered phone)
// @access  Private (owners, admin, super-admin)
router.patch('/:id/toggle-power', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const isOwner =
      device.assignedTo &&
      device.assignedTo.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super-admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to control this device' });
    }

    const desiredState =
      typeof req.body.isOn === 'boolean' ? req.body.isOn : !device.isOn;

    const now = new Date();
    const powerRatingW = device.powerRatingW || 0;
    let totalWh = device.energyConsumption?.totalUsage || 0;

    // Accumulate energy from the last ON interval, if applicable
    if (device.isOn && device.lastPowerOnAt) {
      const elapsedMs = now.getTime() - new Date(device.lastPowerOnAt).getTime();
      const hours = elapsedMs / (1000 * 60 * 60);
      totalWh += hours * powerRatingW;
    }

    device.energyConsumption = {
      ...device.energyConsumption,
      totalUsage: totalWh,
    };

    if (desiredState) {
      device.isOn = true;
      device.status = 'Online';
      device.lastPowerOnAt = now;
      device.energyConsumption.currentUsage = powerRatingW;
    } else {
      device.isOn = false;
      device.status = 'Offline';
      device.lastPowerOnAt = null;
      device.energyConsumption.currentUsage = 0;
    }

    const pricePerKwh = 0.2;
    device.energyConsumption.cost = (totalWh / 1000) * pricePerKwh;
    device.lastUpdated = now;

    await device.save();

    const populated = await Device.findById(device._id)
      .populate('assignedTo', 'name email userId');
    const liveConsumption = computeLiveConsumption(populated);

    res.json({
      ...populated.toObject(),
      liveConsumption,
    });
  } catch (error) {
    console.error('Toggle power error:', error);
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

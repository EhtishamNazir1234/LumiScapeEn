import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/users
// @desc    Get all users with filtering
// @access  Private (Admin/Super-admin)
router.get('/', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    // Users can only view their own profile unless they're admin
    if (req.user.role !== 'super-admin' && req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to view this user' });
    }

    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users
// @desc    Create a new user/admin
// @access  Private (Super-admin only)
router.post('/', authorize('super-admin'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'enterprise', 'end-user', 'customer-care']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, role, country } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: role || 'end-user',
      country: country || 'Not assigned'
    });

    const userResponse = await User.findById(user._id).select('-password');
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', [
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('role').optional().isIn(['super-admin', 'admin', 'enterprise', 'end-user', 'customer-care'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check authorization
    if (req.user.role !== 'super-admin' && req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    // Prevent non-super-admins from changing roles
    if (req.body.role && req.user.role !== 'super-admin') {
      delete req.body.role;
    }

    // When user updates own profile, only allow specific fields (including profileImage)
    const isSelfUpdate = req.user._id.toString() === req.params.id;
    const allowedSelfFields = ['name', 'email', 'phone', 'profileImage'];
    const updatePayload = isSelfUpdate
      ? allowedSelfFields.reduce((acc, key) => {
          if (req.body[key] !== undefined) acc[key] = req.body[key];
          return acc;
        }, {})
      : req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/archive
// @desc    Archive user
// @access  Private (Admin/Super-admin)
router.put('/:id/archive', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'Archived' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User archived successfully', user });
  } catch (error) {
    console.error('Archive user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Super-admin only)
router.delete('/:id', authorize('super-admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting super-admin
    if (user.role === 'super-admin') {
      return res.status(400).json({ message: 'Cannot delete super-admin user' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

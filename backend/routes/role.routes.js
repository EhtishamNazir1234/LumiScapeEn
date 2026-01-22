import express from 'express';
import { body, validationResult } from 'express-validator';
import Role from '../models/Role.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/roles
// @desc    Get all roles
// @access  Private (Admin/Super-admin)
router.get('/', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(roles);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/roles/:id
// @desc    Get single role
// @access  Private (Admin/Super-admin)
router.get('/:id', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json(role);
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/roles
// @desc    Create new role
// @access  Private (Super-admin only)
router.post('/', authorize('super-admin'), [
  body('roleName').trim().notEmpty().withMessage('Role name is required'),
  body('permissions').isArray().withMessage('Permissions must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { roleName, description, permissions } = req.body;

    const roleExists = await Role.findOne({ roleName });
    if (roleExists) {
      return res.status(400).json({ message: 'Role with this name already exists' });
    }

    const role = await Role.create({
      roleName,
      description: description || '',
      permissions: permissions || []
    });

    res.status(201).json(role);
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/roles/:id
// @desc    Update role
// @access  Private (Super-admin only)
router.put('/:id', authorize('super-admin'), async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json(role);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/roles/:id
// @desc    Delete role
// @access  Private (Super-admin only)
router.delete('/:id', authorize('super-admin'), async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json({ message: 'Role deactivated successfully', role });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

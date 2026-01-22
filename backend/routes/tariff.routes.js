import express from 'express';
import { body, validationResult } from 'express-validator';
import Tariff from '../models/Tariff.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/tariff
// @desc    Get all tariffs
// @access  Private
router.get('/', async (req, res) => {
  try {
    const tariffs = await Tariff.find({ isActive: true }).sort({ name: 1 });
    res.json(tariffs);
  } catch (error) {
    console.error('Get tariffs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tariff
// @desc    Create new tariff
// @access  Private (Admin/Super-admin)
router.post('/', authorize('super-admin', 'admin'), [
  body('name').trim().notEmpty().withMessage('Tariff name is required'),
  body('value').isNumeric().withMessage('Value must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tariff = await Tariff.create(req.body);
    res.status(201).json(tariff);
  } catch (error) {
    console.error('Create tariff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tariff/:id
// @desc    Update tariff
// @access  Private (Admin/Super-admin)
router.put('/:id', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const tariff = await Tariff.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!tariff) {
      return res.status(404).json({ message: 'Tariff not found' });
    }

    res.json(tariff);
  } catch (error) {
    console.error('Update tariff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tariff/:id
// @desc    Delete tariff
// @access  Private (Admin/Super-admin)
router.delete('/:id', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const tariff = await Tariff.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!tariff) {
      return res.status(404).json({ message: 'Tariff not found' });
    }

    res.json({ message: 'Tariff deactivated successfully', tariff });
  } catch (error) {
    console.error('Delete tariff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

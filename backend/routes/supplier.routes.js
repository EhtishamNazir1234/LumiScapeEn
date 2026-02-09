import express from 'express';
import { body, validationResult } from 'express-validator';
import Supplier from '../models/Supplier.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/suppliers
// @desc    Get all suppliers
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { city, country, search, itemsSupplied, page = 1, limit = 10 } = req.query;

    const conditions = [{ status: { $ne: 'Archived' } }];

    if (city) {
      const cities = city.split(',').map((c) => c.trim()).filter(Boolean);
      if (cities.length > 1) {
        conditions.push({
          $or: cities.map((c) => ({ city: { $regex: c, $options: 'i' } })),
        });
      } else if (cities.length === 1) {
        conditions.push({ city: { $regex: cities[0], $options: 'i' } });
      }
    }

    if (country) {
      conditions.push({ country: { $regex: country, $options: 'i' } });
    }

    if (search) {
      conditions.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { supplierId: { $regex: search, $options: 'i' } },
        ],
      });
    }

    if (itemsSupplied) {
      const items = itemsSupplied.split(',').map((i) => i.trim()).filter(Boolean);
      if (items.length > 0) {
        conditions.push({ itemsSupplied: { $in: items } });
      }
    }

    const query = conditions.length > 1 ? { $and: conditions } : conditions[0];

    const skip = (page - 1) * limit;

    const suppliers = await Supplier.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Supplier.countDocuments(query);
    
    res.json({
      suppliers,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/suppliers/:id
// @desc    Get single supplier
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/suppliers
// @desc    Create new supplier
// @access  Private (Admin/Super-admin)
router.post('/', authorize('super-admin', 'admin'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, city, country, itemsSupplied } = req.body;

    const supplierExists = await Supplier.findOne({ email });
    if (supplierExists) {
      return res.status(400).json({ message: 'Supplier already exists with this email' });
    }

    const supplier = await Supplier.create({
      name,
      email,
      phone,
      city: city || '',
      country: country || 'Not assigned',
      itemsSupplied: itemsSupplied || []
    });

    res.status(201).json(supplier);
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/suppliers/:id
// @desc    Update supplier
// @access  Private (Admin/Super-admin)
router.put('/:id', authorize('super-admin', 'admin'), [
  body('email').optional().isEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/suppliers/:id
// @desc    Permanently delete supplier
// @access  Private (Admin/Super-admin)
router.delete('/:id', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

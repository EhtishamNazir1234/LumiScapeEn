import express from 'express';
import { body, validationResult } from 'express-validator';
import Report from '../models/Report.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/reports
// @desc    Get all reports
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { type, status, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    // Regular users can only see their own reports
    if (req.user.role === 'end-user' || req.user.role === 'enterprise') {
      query.exportedBy = req.user._id;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.reportName = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    
    const reports = await Report.find(query)
      .populate('exportedBy', 'name email userId')
      .sort({ exportedOn: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Report.countDocuments(query);
    
    res.json({
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reports
// @desc    Generate new report
// @access  Private
router.post('/', [
  body('reportName').trim().notEmpty().withMessage('Report name is required'),
  body('type').isIn(['Scheduled', 'On-Demand']).withMessage('Invalid report type'),
  body('format').isIn(['PDF', 'Excel', 'CSV', 'TXT']).withMessage('Invalid report format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reportName, type, format, deliveredTo, parameters } = req.body;

    const report = await Report.create({
      reportName,
      type,
      format,
      deliveredTo: deliveredTo || 'Dashboard',
      exportedBy: req.user._id,
      exportedByName: req.user.name,
      status: 'Processing',
      parameters: parameters || {}
    });

    // In production, trigger report generation process here
    // For now, simulate success after a delay
    setTimeout(async () => {
      await Report.findByIdAndUpdate(report._id, { status: 'Sent' });
    }, 2000);

    const populatedReport = await Report.findById(report._id)
      .populate('exportedBy', 'name email userId');
    
    res.status(201).json(populatedReport);
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reports/:id
// @desc    Get single report
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('exportedBy', 'name email userId');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check authorization
    if ((req.user.role === 'end-user' || req.user.role === 'enterprise') && 
        report.exportedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this report' });
    }

    res.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reports/:id
// @desc    Delete report
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Only creator or admin-like roles can delete
    const isOwner = report.exportedBy.toString() === req.user._id.toString();
    const isAdminRole = ['super-admin', 'admin'].includes(req.user.role);

    if (!isOwner && !isAdminRole) {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }

    await Report.findByIdAndDelete(req.params.id);

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

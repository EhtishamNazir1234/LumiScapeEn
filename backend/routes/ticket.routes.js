import express from 'express';
import { body, validationResult } from 'express-validator';
import Ticket from '../models/Ticket.model.js';
import User from '../models/User.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/tickets
// @desc    Get all tickets
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, type, assignedTo, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    // Regular users can only see their own tickets
    if (req.user.role === 'end-user' || req.user.role === 'enterprise') {
      query.userEmail = req.user.email;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }
    
    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { issueTitle: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const tickets = await Ticket.find(query)
      .populate('assignedTo', 'name email userId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Ticket.countDocuments(query);
    
    res.json({
      tickets,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tickets/stats
// @desc    Get ticket statistics
// @access  Private
router.get('/stats', authorize('super-admin', 'admin', 'customer-care'), async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const complaints = await Ticket.countDocuments({ type: 'Complaint' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
    const pendingTickets = await Ticket.countDocuments({ status: { $in: ['New', 'Pending', 'In Progress', 'Unresolved'] } });

    // Calculate resolution rate
    const resolutionRate = totalTickets > 0 ? ((resolvedTickets / totalTickets) * 100).toFixed(1) : 0;

    res.json({
      totalTickets,
      complaints,
      resolvedTickets,
      pendingTickets,
      resolutionRate: `${resolutionRate}%`
    });
  } catch (error) {
    console.error('Get ticket stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tickets/:id
// @desc    Get single ticket
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('assignedTo', 'name email userId');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user has permission to view this ticket
    if ((req.user.role === 'end-user' || req.user.role === 'enterprise') && 
        ticket.userEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tickets
// @desc    Create new ticket
// @access  Private
router.post('/', [
  body('type').isIn(['Complaint', 'Bug Report', 'Info Request', 'Feature Request', 'Other']).withMessage('Invalid ticket type'),
  body('ticketNotes').trim().notEmpty().withMessage('Ticket notes are required'),
  body('userName').trim().notEmpty().withMessage('User name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, ticketNotes, issueTitle, severity } = req.body;

    const ticket = await Ticket.create({
      userName: req.user.name,
      userEmail: req.user.email,
      type,
      ticketNotes,
      issueTitle: issueTitle || '',
      severity: severity || 'Medium',
      assignedToName: 'Not assigned'
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('assignedTo', 'name email userId');
    
    res.status(201).json(populatedTicket);
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tickets/:id
// @desc    Update ticket
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Only admins and customer care can update tickets
    if (req.user.role !== 'super-admin' && req.user.role !== 'admin' && req.user.role !== 'customer-care') {
      if (ticket.userEmail !== req.user.email) {
        return res.status(403).json({ message: 'Not authorized to update this ticket' });
      }
      // Regular users can only update certain fields
      const allowedFields = ['ticketNotes', 'issueTitle'];
      Object.keys(req.body).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete req.body[key];
        }
      });
    }

    // Update assignedTo name if assignedTo is set
    if (req.body.assignedTo) {
      const assignedUser = await User.findById(req.body.assignedTo);
      if (assignedUser) {
        req.body.assignedToName = assignedUser.name;
      }
    }

    // Set resolvedOn if status is changed to Resolved
    if (req.body.status === 'Resolved' && ticket.status !== 'Resolved') {
      req.body.resolvedOn = new Date();
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email userId');

    res.json(updatedTicket);
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tickets/:id/assign
// @desc    Assign ticket to admin
// @access  Private (Admin/Super-admin/Customer Care)
router.put('/:id/assign', authorize('super-admin', 'admin', 'customer-care'), [
  body('assignedTo').notEmpty().withMessage('User ID to assign is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { assignedTo } = req.body;
    const assignedUser = await User.findById(assignedTo);
    
    if (!assignedUser) {
      return res.status(404).json({ message: 'User to assign not found' });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo,
        assignedToName: assignedUser.name
      },
      { new: true }
    ).populate('assignedTo', 'name email userId');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tickets/:id
// @desc    Delete ticket
// @access  Private (Super-admin only)
router.delete('/:id', authorize('super-admin'), async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

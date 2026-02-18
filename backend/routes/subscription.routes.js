import express from 'express';
import { body, validationResult } from 'express-validator';
import Stripe from 'stripe';
import Subscription from '../models/Subscription.model.js';
import Plan from '../models/Plan.model.js';
import User from '../models/User.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

router.use(protect);

// @route   GET /api/subscriptions
// @desc    Get all subscriptions
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    // Regular users can only see their own subscriptions
    if (req.user.role === 'end-user' || req.user.role === 'enterprise') {
      query.userId = req.user._id;
    }
    
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    
    const subscriptions = await Subscription.find(query)
      .populate('userId', 'name email userId')
      .populate('planId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Subscription.countDocuments(query);
    
    res.json({
      subscriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/subscriptions/plans
// @desc    Get all subscription plans
// @access  Private
router.get('/plans', async (req, res) => {
  try {
    const { billingCycle } = req.query;
    
    const query = { isActive: true };
    if (billingCycle) {
      query.billingCycle = billingCycle;
    }

    const plans = await Plan.find(query).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/subscriptions/plans
// @desc    Create subscription plan
// @access  Private (Super-admin only)
router.post('/plans', authorize('super-admin'), [
  body('name').trim().notEmpty().withMessage('Plan name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('billingCycle').isIn(['monthly', 'annual']).withMessage('Invalid billing cycle')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const plan = await Plan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/subscriptions/plans/:id
// @desc    Update subscription plan
// @access  Private (Super-admin only)
router.put('/plans/:id', authorize('super-admin'), async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/subscriptions/create-checkout-session
// @desc    Create Stripe Checkout session for payment (users subscribe after payment)
// @access  Private (enterprise, end-user for self; admin for others)
router.post('/create-checkout-session', [
  body('planId').notEmpty().withMessage('Plan ID is required'),
  body('userId').optional(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.body.userId || req.user._id;
    const planId = req.body.planId;

    if (userId.toString() !== req.user._id.toString() &&
        req.user.role !== 'super-admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({ message: 'Payment is not configured. Please contact support.' });
    }

    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const successUrl = `${baseUrl}/subscribe?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/subscribe?canceled=true`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${plan.name} Plan`,
            description: plan.description || `LumiScape ${plan.name} subscription - ${plan.billingCycle}`,
            metadata: { planId: planId.toString(), planName: plan.name },
          },
          unit_amount: Math.round(plan.price * 100),
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId.toString(),
      metadata: { planId: planId.toString(), userId: userId.toString() },
      customer_email: req.user.email,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ message: error.message || 'Failed to create checkout session' });
  }
});

// @route   POST /api/subscriptions/confirm-from-client
// @desc    Fallback: create or sync subscription after successful checkout (when webhook is not available).
// @access  Private
router.post('/confirm-from-client', async (req, res) => {
  try {
    const userId = req.user._id;
    const { planId } = req.body || {};

    if (!planId) {
      return res.status(400).json({ message: 'Plan ID is required' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Try to find existing active subscription for this user & plan
    let subscription = await Subscription.findOne({
      userId,
      planId: plan._id,
      status: 'Active'
    });

    // Calculate expiry date
    const expiryDate = new Date();
    if (plan.billingCycle === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    if (!subscription) {
      subscription = await Subscription.create({
        userId,
        planId: plan._id,
        planName: plan.name,
        price: plan.price,
        billingCycle: plan.billingCycle,
        expiryDate
      });
    } else {
      // Keep it active and make sure expiry is at least the new date
      subscription.status = 'Active';
      if (!subscription.expiryDate || subscription.expiryDate < expiryDate) {
        subscription.expiryDate = expiryDate;
      }
      await subscription.save();
    }

    // Update user subscription info
    user.subscription = plan.name;
    user.subscriptionStatus = 'Active';
    user.subscriptionExpiryDate = subscription.expiryDate;
    await user.save();

    const populatedSubscription = await Subscription.findById(subscription._id)
      .populate('userId', 'name email userId')
      .populate('planId');

    res.json(populatedSubscription);
  } catch (error) {
    console.error('Confirm subscription from client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/subscriptions
// @desc    Create new subscription (direct - for admin assignments; payment flow uses webhook)
// @access  Private
router.post('/', [
  body('planId').notEmpty().withMessage('Plan ID is required'),
  body('userId').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.body.userId || req.user._id;
    const planId = req.body.planId;

    // Only admins can create subscriptions for other users
    if (userId.toString() !== req.user._id.toString() && 
        req.user.role !== 'super-admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create subscription for other users' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate expiry date
    const expiryDate = new Date();
    if (plan.billingCycle === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    const subscription = await Subscription.create({
      userId,
      planId,
      planName: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
      expiryDate
    });

    // Update user subscription info
    user.subscription = plan.name;
    user.subscriptionStatus = 'Active';
    user.subscriptionExpiryDate = expiryDate;
    await user.save();

    const populatedSubscription = await Subscription.findById(subscription._id)
      .populate('userId', 'name email userId')
      .populate('planId');
    
    res.status(201).json(populatedSubscription);
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/subscriptions/revenue
// @desc    Get revenue analytics
// @access  Private (Admin/Super-admin)
router.get('/revenue', authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const totalRevenue = await Subscription.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    const monthlyRevenue = await Subscription.aggregate([
      {
        $match: {
          status: 'Active',
          billingCycle: 'monthly'
        }
      },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    const annualRevenue = await Subscription.aggregate([
      {
        $match: {
          status: 'Active',
          billingCycle: 'annual'
        }
      },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      annualRevenue: annualRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

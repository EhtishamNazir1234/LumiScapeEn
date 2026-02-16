/**
 * Stripe webhook handler - must use raw body for signature verification.
 * Mount this route BEFORE express.json() in server.js.
 */
import express from 'express';
import Stripe from 'stripe';
import Subscription from '../models/Subscription.model.js';
import Plan from '../models/Plan.model.js';
import User from '../models/User.model.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const handleCheckoutComplete = async (session) => {
  const { planId, userId } = session.metadata || {};
  if (!planId || !userId) {
    console.error('Webhook: missing planId or userId in session metadata');
    return;
  }

  const existingSub = await Subscription.findOne({ stripeSessionId: session.id });
  if (existingSub) {
    console.log('Webhook: subscription already created for session', session.id);
    return;
  }

  const plan = await Plan.findById(planId);
  if (!plan) {
    console.error('Webhook: plan not found', planId);
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    console.error('Webhook: user not found', userId);
    return;
  }

  const expiryDate = new Date();
  if (plan.billingCycle === 'monthly') {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  } else {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  }

  await Subscription.create({
    userId,
    planId,
    planName: plan.name,
    price: plan.price,
    billingCycle: plan.billingCycle,
    expiryDate,
    stripeSessionId: session.id,
  });

  user.subscription = plan.name;
  user.subscriptionStatus = 'Active';
  user.subscriptionExpiryDate = expiryDate;
  await user.save();

  console.log('Webhook: subscription created for user', userId, 'plan', plan.name);
};

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return res.status(500).json({ message: 'Webhook not configured' });
  }

  let event;
  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.mode === 'payment') {
      await handleCheckoutComplete(session);
    }
  }

  res.json({ received: true });
});

export default router;
export { handleCheckoutComplete };

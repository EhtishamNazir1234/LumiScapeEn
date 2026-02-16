/**
 * Seed subscription plans into the database.
 * Run: node scripts/seedPlans.js (from backend directory)
 * Or: npm run seed:plans
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from '../models/Plan.model.js';

dotenv.config();

const plans = [
  {
    name: 'Basic',
    price: 200,
    billingCycle: 'monthly',
    description: 'Ideal for small setups or users new to energy tracking',
    isActive: true,
    features: [
      { label: 'Control & schedule devices', allow: true },
      { label: 'Time-based automations', allow: true },
      { label: 'Real-time energy tracking', allow: true },
      { label: 'Usage & kWh analysis', allow: true },
      { label: 'Custom Reports (PDF/CSV)', allow: true },
    ],
  },
  {
    name: 'Basic',
    price: 1200,
    billingCycle: 'annual',
    description: 'Ideal for small setups or users new to energy tracking',
    isActive: true,
    features: [
      { label: 'Control & schedule devices', allow: true },
      { label: 'Time-based automations', allow: true },
      { label: 'Real-time energy tracking', allow: true },
      { label: 'Usage & kWh analysis', allow: true },
      { label: 'Custom Reports (PDF/CSV)', allow: true },
    ],
  },
  {
    name: 'Standard',
    price: 500,
    billingCycle: 'monthly',
    description: 'Perfect for growing smart spaces and deeper energy insights',
    isActive: true,
    features: [
      { label: 'Control & schedule devices', allow: true },
      { label: 'Time-based automations', allow: true },
      { label: 'Real-time energy tracking', allow: true },
      { label: 'AI Powered Insights', allow: true },
      { label: 'Smart Alerts', allow: true },
      { label: 'Custom Energy Goals & Tracking', allow: true },
      { label: 'Custom Reports (PDF/CSV)', allow: true },
    ],
  },
  {
    name: 'Standard',
    price: 3000,
    billingCycle: 'annual',
    description: 'Perfect for growing smart spaces and deeper energy insights',
    isActive: true,
    features: [
      { label: 'Control & schedule devices', allow: true },
      { label: 'Time-based automations', allow: true },
      { label: 'Real-time energy tracking', allow: true },
      { label: 'AI Powered Insights', allow: true },
      { label: 'Smart Alerts', allow: true },
      { label: 'Custom Energy Goals & Tracking', allow: true },
      { label: 'Custom Reports (PDF/CSV)', allow: true },
    ],
  },
  {
    name: 'Premium',
    price: 1000,
    billingCycle: 'monthly',
    description: 'Best for full control, automation, and energy optimization',
    isActive: true,
    features: [
      { label: 'Control & schedule devices', allow: true },
      { label: 'Time-based automations', allow: true },
      { label: 'Real-time energy tracking', allow: true },
      { label: 'AI Powered Insights', allow: true },
      { label: 'Multi-User Access', allow: true },
      { label: 'Voice Assistant Integration', allow: true },
      { label: 'Custom Reports (PDF/CSV)', allow: true },
      { label: 'Customer Support', allow: true },
    ],
  },
  {
    name: 'Premium',
    price: 6000,
    billingCycle: 'annual',
    description: 'Best for full control, automation, and energy optimization',
    isActive: true,
    features: [
      { label: 'Control & schedule devices', allow: true },
      { label: 'Time-based automations', allow: true },
      { label: 'Real-time energy tracking', allow: true },
      { label: 'AI Powered Insights', allow: true },
      { label: 'Multi-User Access', allow: true },
      { label: 'Voice Assistant Integration', allow: true },
      { label: 'Custom Reports (PDF/CSV)', allow: true },
      { label: 'Customer Support', allow: true },
    ],
  },
];

async function seedPlans() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lumiscape';
    await mongoose.connect(uri);
    console.log('MongoDB connected');

    const count = await Plan.countDocuments();
    if (count > 0) {
      console.log(`Plans already exist (${count} plans). Skipping seed.`);
      process.exit(0);
      return;
    }

    await Plan.insertMany(plans);
    console.log(`Successfully seeded ${plans.length} plans.`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedPlans();

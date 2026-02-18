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
    price: 20,
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
    price: 240,
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
    price: 40,
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
    price: 480,
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
    price: 55,
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
    price: 660,
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

    const results = await Promise.all(
      plans.map((plan) =>
        Plan.findOneAndUpdate(
          { name: plan.name, billingCycle: plan.billingCycle },
          { $set: plan },
          { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        )
      )
    );

    console.log(`Seed complete. Upserted ${results.length} plans.`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedPlans();

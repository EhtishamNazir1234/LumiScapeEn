import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['super-admin', 'admin', 'enterprise', 'end-user', 'customer-care'],
    default: 'end-user'
  },
  userId: {
    type: String,
    unique: true
  },
  subscription: {
    type: String,
    enum: ['Basic', 'Standard', 'Premium', null],
    default: null
  },
  subscriptionStatus: {
    type: String,
    enum: ['Active', 'Expired', 'Inactive'],
    default: 'Inactive'
  },
  subscriptionExpiryDate: {
    type: Date
  },
  country: {
    type: String,
    default: 'Not assigned'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Archived'],
    default: 'Active'
  },
  lastLogin: {
    type: Date
  },
  permissions: [{
    label: String,
    permission: Boolean
  }],
  // Per-user notification preferences for the dashboard UI.
  // All fields default to true so existing users receive notifications
  // until they explicitly opt out via Notification Settings.
  notificationPreferences: {
    enableAll: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: true },
    suspiciousLoginAlerts: { type: Boolean, default: true },
    unusualEnergyConsumption: { type: Boolean, default: true },
    groupEnergyLimitBreached: { type: Boolean, default: true },
    userGroupMembershipChanges: { type: Boolean, default: true },
    manualDeviceAdditionRequests: { type: Boolean, default: true },
    systemMaintenanceNotices: { type: Boolean, default: true },
    appVersionUpdates: { type: Boolean, default: true },
  },
  rememberMe: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: null
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate userId if not provided
userSchema.pre('save', async function(next) {
  if (!this.userId) {
    this.userId = `User${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

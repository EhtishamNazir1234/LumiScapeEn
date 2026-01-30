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
  rememberMe: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: null
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

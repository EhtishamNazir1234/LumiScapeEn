import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  serial: {
    type: String,
    required: true,
    unique: true
  },
  deviceId: {
    type: String,
    unique: true
  },
  category: {
    type: String,
    enum: ['Switch', 'Sensor', 'Energy', 'Lighting', 'Other'],
    required: true
  },
  type: {
    type: String,
    required: true
  },
  variant: {
    type: String
  },
  status: {
    type: String,
    enum: ['Online', 'Offline', 'Maintenance'],
    default: 'Offline'
  },
  location: {
    building: String,
    floor: String,
    room: String,
    zone: String
  },
  energyConsumption: {
    currentUsage: { type: Number, default: 0 },
    totalUsage: { type: Number, default: 0 },
    cost: { type: Number, default: 0 }
  },
  firmwareVersion: {
    type: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate deviceId if not provided
deviceSchema.pre('save', async function(next) {
  if (!this.deviceId) {
    this.deviceId = `DVC-${Date.now()}`;
  }
  next();
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;

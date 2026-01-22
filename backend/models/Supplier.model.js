import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
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
    required: true,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true,
    default: 'Not assigned'
  },
  supplierId: {
    type: String,
    unique: true
  },
  itemsSupplied: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Archived'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Generate supplierId if not provided
supplierSchema.pre('save', async function(next) {
  if (!this.supplierId) {
    this.supplierId = `Brume-${Date.now()}`;
  }
  next();
});

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;

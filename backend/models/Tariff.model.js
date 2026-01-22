import mongoose from 'mongoose';

const tariffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Tariff = mongoose.model('Tariff', tariffSchema);

export default Tariff;

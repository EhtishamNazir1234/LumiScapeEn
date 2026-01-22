import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  permissions: [{
    id: Number,
    label: String,
    permission: Boolean
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Role = mongoose.model('Role', roleSchema);

export default Role;

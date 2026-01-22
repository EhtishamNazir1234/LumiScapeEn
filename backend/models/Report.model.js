import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Scheduled', 'On-Demand'],
    required: true
  },
  format: {
    type: String,
    enum: ['PDF', 'Excel', 'CSV', 'TXT'],
    required: true
  },
  exportedOn: {
    type: Date,
    default: Date.now
  },
  exportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exportedByName: {
    type: String,
    required: true
  },
  deliveredTo: {
    type: String,
    enum: ['Email', 'Dashboard'],
    default: 'Dashboard'
  },
  status: {
    type: String,
    enum: ['Sent', 'Processing', 'Failed'],
    default: 'Processing'
  },
  filePath: {
    type: String
  },
  parameters: {
    type: Object
  }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

export default Report;

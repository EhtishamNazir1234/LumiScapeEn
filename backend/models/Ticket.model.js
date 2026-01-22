import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String
  },
  type: {
    type: String,
    enum: ['Complaint', 'Bug Report', 'Info Request', 'Feature Request', 'Other'],
    required: true
  },
  issueTitle: {
    type: String
  },
  ticketNotes: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Resolved', 'Unresolved', 'Pending', 'Open'],
    default: 'New'
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedToName: {
    type: String,
    default: 'Not assigned'
  },
  reportedOn: {
    type: Date,
    default: Date.now
  },
  resolvedOn: {
    type: Date
  },
  resolutionNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Generate ticket number if not provided
ticketSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    this.ticketNumber = `#${Date.now()}`;
  }
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;

const mongoose = require('mongoose');

// Counter Schema for managing auto-increment IDs
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});

// Create model for Counter collection
const Counter = mongoose.model('Counter', counterSchema);

// OdRequest Schema
const odRequestSchema = new mongoose.Schema({
  _id: { type: Number, index: true },
  roll_no: { type: String, required: true },
  student_name: { type: String, required: true },
  company_name: { type: String, required: true },
  college_name: { type: String, required: true },
  program_name: { type: String, required: true },
  student_email: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  events: { type: [String], required: true },
  mentor_id: { type: String, required: true },
  campus_selection: { type: String, required: true }, // Added new field
  contacted_phone_number: { type: String, required: true }, // Added new field
  parent_phone_number: { type: String, required: true }, // Added new field
  request_date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  certificate_uploaded: { type: Boolean, default: false },
  certificate_path: { type: String, default: null },
  mentor_approval_status: { type: String, default: 'pending' },
  classincharge_approval_status: { type: String, default: 'pending' },
  hod_approval_status: { type: String, default: 'pending' },
  approval_reason: { type: String },
});

// Pre-save middleware to increment and assign _id
odRequestSchema.pre('save', function(next) {
  const doc = this;
  Counter.findByIdAndUpdate(
    { _id: 'odRequest_id' }, // Assuming 'odRequest_id' is the identifier for this counter
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  ).then(counter => {
    doc._id = counter.sequence_value;
    next();
  }).catch(err => {
    console.error('Error in generating ID:', err);
    next(err);
  });
});

module.exports = mongoose.model('OdRequest', odRequestSchema);

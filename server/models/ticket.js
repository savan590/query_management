// models/Complaint.js
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  user: {
    type: String,
    ref: 'User',
    // required: true,
  },
  title: {
    type: String,
    required: true,
    unique : true,
  },
  description: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: String, 
    enum: ["savan", "jay", "dhruv", "meet"], 
    default: 'savan',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);

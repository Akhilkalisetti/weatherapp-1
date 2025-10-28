const mongoose = require('mongoose');

const workReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  project: {
    type: String,
    required: true
  },
  tasks: {
    type: String,
    required: true
  },
  location: {
    type: String,
    enum: ['home', 'office'],
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'pending'],
    default: 'in-progress'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkReport', workReportSchema);


const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Please add a student']
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: [true, 'Please add a test']
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Please add a class']
  },
  score: {
    type: Number,
    required: [true, 'Please add a score']
  },
  obtainedMarks: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
});

// Add indexes for faster queries
scoreSchema.index({ studentId: 1 });
scoreSchema.index({ testId: 1 });
scoreSchema.index({ classId: 1 });
scoreSchema.index({ classId: 1, score: -1 }); // For leaderboard sorting

module.exports = mongoose.model('Score', scoreSchema); 
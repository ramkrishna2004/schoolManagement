const mongoose = require('mongoose');

const StudentTestAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
  },
  submittedAnswers: {
    type: Map,
    of: String, // Key: questionId, Value: student's answer
    default: new Map()
  },
  score: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'expired', 'evaluated'],
    default: 'in-progress'
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
}, {
  timestamps: true
});

StudentTestAttemptSchema.index({ studentId: 1, testId: 1 }, { unique: true });

module.exports = mongoose.model('StudentTestAttempt', StudentTestAttemptSchema); 
const mongoose = require('mongoose');

const materialAccessSchema = new mongoose.Schema({
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: [true, 'Please specify the material']
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Please specify the student']
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Please specify the class']
  },
  accessType: {
    type: String,
    enum: ['view', 'download'],
    required: [true, 'Please specify access type']
  },
  accessedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
});

// Add indexes for faster queries
materialAccessSchema.index({ materialId: 1, studentId: 1 });
materialAccessSchema.index({ classId: 1, studentId: 1 });
materialAccessSchema.index({ accessedAt: -1 });

module.exports = mongoose.model('MaterialAccess', materialAccessSchema); 
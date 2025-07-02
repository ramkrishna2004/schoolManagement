const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a material title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide file URL']
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Please specify the class']
  },
  subjectName: {
    type: String,
    trim: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'uploadedByModel',
    required: [true, 'Please specify who uploaded']
  },
  uploadedByModel: {
    type: String,
    required: true,
    enum: ['Admin', 'Teacher']
  },
  category: {
    type: String,
    enum: ['lecture', 'assignment', 'study_guide', 'reference', 'other'],
    default: 'other'
  },
  topic: {
    type: String,
    trim: true
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  downloadCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
});

// Update the updatedAt field before saving
materialSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for faster queries
materialSchema.index({ classId: 1 });
materialSchema.index({ uploadedBy: 1 });
materialSchema.index({ category: 1 });
materialSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Material', materialSchema); 
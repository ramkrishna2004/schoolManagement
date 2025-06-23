const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, 'Please add a class name'],
    trim: true
  },
  subjectName: {
    type: String,
    required: [true, 'Please add a subject name'],
    trim: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'Please add a teacher']
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Please add an admin']
  },
  studentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster queries
classSchema.index({ teacherId: 1 });
classSchema.index({ adminId: 1 });
classSchema.index({ studentIds: 1 });

module.exports = mongoose.model('Class', classSchema); 
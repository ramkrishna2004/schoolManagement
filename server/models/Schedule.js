const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Please add a class']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject']
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'Please add a teacher']
  },
  dayOfWeek: {
    type: String,
    required: [true, 'Please add a day of week'],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: {
    type: String,
    required: [true, 'Please add a start time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please add a valid time in HH:MM format']
  },
  endTime: {
    type: String,
    required: [true, 'Please add an end time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please add a valid time in HH:MM format']
  },
  room: {
    type: String,
    required: [true, 'Please add a room number']
  },
  isActive: {
    type: Boolean,
    default: true
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

// Add indexes for faster queries
scheduleSchema.index({ classId: 1 });
scheduleSchema.index({ teacherId: 1 });
scheduleSchema.index({ dayOfWeek: 1 });
scheduleSchema.index({ isActive: 1 });

// Add validation to ensure end time is after start time
scheduleSchema.pre('save', function(next) {
  const start = new Date(`2000-01-01T${this.startTime}`);
  const end = new Date(`2000-01-01T${this.endTime}`);
  
  if (end <= start) {
    next(new Error('End time must be after start time'));
  }
  next();
});

// Add validation to check for schedule conflicts
scheduleSchema.pre('save', async function(next) {
  const Schedule = mongoose.model('Schedule');
  
  // Check for teacher conflicts
  const teacherConflict = await Schedule.findOne({
    teacherId: this.teacherId,
    dayOfWeek: this.dayOfWeek,
    isActive: true,
    _id: { $ne: this._id },
    $or: [
      {
        startTime: { $lt: this.endTime },
        endTime: { $gt: this.startTime }
      }
    ]
  });

  if (teacherConflict) {
    next(new Error('Teacher has a conflicting schedule'));
  }

  // Check for room conflicts
  const roomConflict = await Schedule.findOne({
    room: this.room,
    dayOfWeek: this.dayOfWeek,
    isActive: true,
    _id: { $ne: this._id },
    $or: [
      {
        startTime: { $lt: this.endTime },
        endTime: { $gt: this.startTime }
      }
    ]
  });

  if (roomConflict) {
    next(new Error('Room has a conflicting schedule'));
  }

  next();
});

module.exports = mongoose.model('Schedule', scheduleSchema); 
const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'createdByRole',
    required: true
  },
  createdByRole: {
    type: String,
    enum: ['Teacher', 'Admin'],
    required: true
  },
  entries: [{
    subject: {
      type: String,
      required: true
    },
    work: {
      type: String,
      required: true
    }
  }],
  date: {
    type: Date,
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
});

module.exports = mongoose.model('Diary', diarySchema);
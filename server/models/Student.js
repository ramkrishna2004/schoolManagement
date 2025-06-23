const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  age: {
    type: Number,
    required: [true, 'Please add an age'],
    min: [5, 'Student must be at least 5 years old']
  },
  extraDetails: {
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    parentContact: {
      type: String,
      required: [true, 'Please add parent contact']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
});

module.exports = mongoose.model('Student', studentSchema); 
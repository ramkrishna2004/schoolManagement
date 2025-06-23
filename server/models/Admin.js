const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  age: {
    type: Number,
    required: [true, 'Please add age'],
    min: [18, 'Admin must be at least 18 years old']
  },
  extraDetails: {
    contact: {
      type: String,
      required: [true, 'Please add a contact number']
    },
    department: {
      type: String,
      required: [true, 'Please add a department']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Admin', adminSchema); 
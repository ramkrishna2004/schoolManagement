const express = require('express');
const router = express.Router();
const { 
  registerTeacher, 
  registerStudent, 
  registerAdmin, 
  login, 
  getMe, 
  updateProfile, 
  changePassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register routes
router.post('/register/admin', registerAdmin);
router.post('/register/student', protect, registerStudent);
router.post('/register/teacher', protect, registerTeacher);

// Login route
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router; 
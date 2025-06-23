const express = require('express');
const router = express.Router();
const {
  registerTeacher,
  registerStudent,
  login,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register routes
router.post('/register/teacher', registerTeacher);
router.post('/register/student', registerStudent);

// Login route
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router; 
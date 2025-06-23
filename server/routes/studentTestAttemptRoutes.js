const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  startTestAttempt,
  getStudentTestAttempt,
  submitTestAttempt
} = require('../controllers/studentTestAttemptController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes for student test attempts
router.route('/start')
  .post(authorize('student'), startTestAttempt);

router.route('/')
  .get(authorize('student'), getStudentTestAttempt);

router.route('/submit')
  .put(authorize('student'), submitTestAttempt);

module.exports = router; 
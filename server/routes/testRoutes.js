const express = require('express');
const router = express.Router();
const {
  getTests,
  getTest,
  createTest,
  updateTest,
  deleteTest
} = require('../controllers/testController');
const { protect, authorize } = require('../middleware/auth');
const questionRouter = require('./questionRoutes');
const studentTestAttemptRouter = require('./studentTestAttemptRoutes');

// Protect all routes
router.use(protect);

// Re-route into question router
router.use('/:testId/questions', questionRouter);

// Re-route into student test attempt router
router.use('/:testId/attempts', studentTestAttemptRouter);

// Routes accessible by admin, teachers and students
router.get('/', authorize('admin', 'teacher', 'student'), getTests);
router.get('/:id', authorize('admin', 'teacher', 'student'), getTest);

// Routes accessible by admin and teachers
router.post('/', authorize('admin', 'teacher'), createTest);
router.put('/:id', authorize('admin', 'teacher'), updateTest);
router.delete('/:id', authorize('admin', 'teacher'), deleteTest);

module.exports = router; 
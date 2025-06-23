const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes accessible by admin and teachers
router.route('/')
  .get(authorize('admin', 'teacher', 'student'), getQuestions)
  .post(authorize('admin', 'teacher'), createQuestion);

router.route('/:id')
  .get(authorize('admin', 'teacher'), getQuestion)
  .put(authorize('admin', 'teacher'), updateQuestion)
  .delete(authorize('admin', 'teacher'), deleteQuestion);

module.exports = router; 
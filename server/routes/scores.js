const express = require('express');
const router = express.Router();
const {
  getScores,
  getScore,
  submitTest,
  updateScore,
  deleteScore,
  getClassLeaderboard
} = require('../controllers/scoreController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes accessible by all authenticated users
router.get('/', getScores);
router.get('/:id', getScore);

// Routes accessible only by students
router.post('/', authorize('student'), submitTest);

// Routes accessible only by admins
router.put('/:id', authorize('admin'), updateScore);
router.delete('/:id', authorize('admin'), deleteScore);

// Leaderboard route accessible by teachers and students
router.get('/classes/:classId/leaderboard', authorize('teacher', 'student'), getClassLeaderboard);

module.exports = router; 
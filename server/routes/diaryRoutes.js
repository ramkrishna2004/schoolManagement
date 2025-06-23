const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');
const { protect } = require('../middleware/auth');

// Create diary (teacher/admin)
router.post('/', protect, diaryController.createDiary);
// Get diaries (all roles, filtered)
router.get('/', protect, diaryController.getDiaries);
// Update diary (teacher/admin)
router.put('/:id', protect, diaryController.updateDiary);
// Delete diary (teacher/admin)
router.delete('/:id', protect, diaryController.deleteDiary);

module.exports = router; 
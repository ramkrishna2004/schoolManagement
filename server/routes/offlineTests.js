const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createOfflineTest, manualScoreEntry, updateManualScoreEntry } = require('../controllers/offlineTestController');

router.use(protect);
router.use(authorize('admin', 'teacher'));

router.post('/create', createOfflineTest);
router.post('/score-entry', manualScoreEntry);
router.put('/update-score-entry', updateManualScoreEntry);

module.exports = router; 
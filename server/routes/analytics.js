const express = require('express');
const router = express.Router();
const {
    getStudentAnalytics,
    getClassAnalytics,
    getAllAnalytics,
    getStudentAnalyticsById,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/student', authorize('student'), getStudentAnalytics);
router.get('/class/:classId', authorize('admin', 'teacher'), getClassAnalytics);
router.get('/all', authorize('admin'), getAllAnalytics);
router.get('/student/:studentId', authorize('admin', 'teacher'), getStudentAnalyticsById);

module.exports = router; 
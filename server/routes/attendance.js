const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getClassAttendance,
  getStudentAttendance,
  updateAttendance,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router.post('/mark', authorize('teacher', 'admin'), markAttendance);
router.get('/class/:classId', authorize('teacher', 'admin'), getClassAttendance);
// Students can see their own, teachers/admins can see any student in their org
router.get('/student/:studentId', getStudentAttendance); 
router.put('/:id', authorize('teacher', 'admin'), updateAttendance);

module.exports = router; 
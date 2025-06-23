const express = require('express');
const {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedulesByClass,
  getSchedulesByTeacher,
  getSchedulesByDay,
  checkConflicts
} = require('../controllers/scheduleController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes accessible by all authenticated users
router.get('/', getSchedules);
router.get('/:id', getSchedule);
router.get('/class/:classId', getSchedulesByClass);
router.get('/teacher/:teacherId', getSchedulesByTeacher);
router.get('/day/:day', getSchedulesByDay);

// Routes accessible only by admin
router.post('/', authorize('admin'), createSchedule);
router.put('/:id', authorize('admin'), updateSchedule);
router.delete('/:id', authorize('admin'), deleteSchedule);
router.post('/check-conflicts', authorize('admin'), checkConflicts);

module.exports = router; 
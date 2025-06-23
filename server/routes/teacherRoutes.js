const express = require('express');
const router = express.Router();
const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  updateTeacherFull,
  deleteTeacherFull
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getTeachers)
  .post(createTeacher);

router.route('/:id')
  .get(getTeacher)
  .put(updateTeacher)
  .delete(deleteTeacher);

// Full update and delete (sync both Teacher and User)
router.route('/:id/full')
  .put(updateTeacherFull)
  .delete(deleteTeacherFull);

module.exports = router; 
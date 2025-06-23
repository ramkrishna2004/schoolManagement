const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsBatch
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const Class = require('../models/Class');
const Student = require('../models/Student');

// Get student's enrolled classes - This needs to be before the global middleware
router.get('/enrolled-classes', protect, authorize('student'), async (req, res) => {
  try {
    // First verify the student exists
    const student = await Student.findById(req.user.roleId);
    console.log('Found student:', student);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Now find classes with this student's ID
    const classes = await Class.find({
      studentIds: student._id
    }).populate('teacherId', 'name email')
      .populate('adminId', 'name email');

    console.log('Found classes:', classes);

    res.json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    console.error('Error in enrolled-classes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Protect all other routes for admin/teacher only
router.use(protect);
router.use(authorize('admin', 'teacher'));

router.route('/')
  .get(getStudents)
  .post(createStudent);

router.route('/:id')
  .get(getStudent)
  .put(updateStudent)
  .delete(deleteStudent);

// Add batch student fetch endpoint
router.post('/batch', protect, authorize('admin', 'teacher', 'student'), getStudentsBatch);

module.exports = router; 
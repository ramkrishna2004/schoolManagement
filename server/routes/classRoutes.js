const express = require('express');
const router = express.Router();
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  addStudent,
  removeStudent
} = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');
const Student = require('../models/Student');
const { adminScopedQuery } = require('../utils/adminQueryHelper');

// Protect all routes
router.use(protect);

// Routes accessible by both admin and teacher
router.get('/', authorize('admin', 'teacher'), getClasses);
router.get('/:id', authorize('admin', 'teacher'), getClass);

// Routes accessible only by admin
router.post('/', authorize('admin'), createClass);
router.put('/:id', authorize('admin'), updateClass);
router.delete('/:id', authorize('admin'), deleteClass);

// Student enrollment routes (accessible by admin and teacher)
router.post('/:id/students', authorize('admin', 'teacher'), addStudent);
router.delete('/:id/students/:studentId', authorize('admin', 'teacher'), removeStudent);

// Get all students in a class
router.get('/:id/students', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const Class = require('../models/Class');
    const Student = require('../models/Student');
    const User = require('../models/User');
    // Only fetch the class if it belongs to the current admin
    const classDoc = await adminScopedQuery(Class, req, { _id: req.params.id }).findOne();
    if (!classDoc) return res.status(404).json({ message: 'Class not found in your organization' });
    // Fetch students by IDs and adminId
    const students = await adminScopedQuery(Student, req, { _id: { $in: classDoc.studentIds } });
    // Fetch corresponding users to get their _id (User _id)
    const users = await User.find({ role: 'student', roleId: { $in: students.map(s => s._id) } });
    // Map students to include roleId (User _id)
    const studentsWithRoleId = students.map(s => {
      const user = users.find(u => u.roleId && u.roleId.toString() === s._id.toString());
      return {
        ...s.toObject(),
        roleId: user ? user._id : null
      };
    });
    res.json(studentsWithRoleId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const { adminScopedQuery } = require('../utils/adminQueryHelper');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
exports.getStudents = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    const query = includeInactive === 'true' ? {} : { isActive: true };

    // Scope by adminId
    const students = await adminScopedQuery(Student, req, query).select('-password');
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin
exports.getStudent = async (req, res) => {
  try {
    // Scope by adminId and _id
    const student = await adminScopedQuery(Student, req, { _id: req.params.id }).select('-password');

    if (!student || (Array.isArray(student) && student.length === 0)) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: Array.isArray(student) ? student[0] : student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
exports.createStudent = async (req, res) => {
  try {
    const { name, email, password, age, extraDetails } = req.body;

    // Check if student already exists
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    const student = await Student.create({
      name,
      email,
      password,
      age,
      extraDetails
    });

    res.status(201).json({
      success: true,
      data: {
        _id: student._id,
        name: student.name,
        email: student.email,
        age: student.age,
        extraDetails: student.extraDetails
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, password, age, extraDetails } = req.body;

    // Check if email is being changed and if it already exists
    if (email) {
      const studentExists = await Student.findOne({ email, _id: { $ne: req.params.id } });
      if (studentExists) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(age && { age }),
      ...(extraDetails && { extraDetails })
    };

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete student (soft delete)
// @route   DELETE /api/students/:id
// @access  Private/Admin
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get multiple students by IDs (from User collection, with authorization)
// @route   POST /api/students/batch
// @access  Private
exports.getStudentsBatch = async (req, res) => {
  try {
    const { ids } = req.body; // array of user IDs
    const userRole = req.user.role;
    const userId = req.user._id;
    let allowedIds = ids;

    if (userRole === 'teacher') {
      const Class = require('../models/Class');
      // Find all students in teacher's classes
      const classes = await Class.find({ teacherId: userId });
      const studentIds = classes.flatMap(cls => cls.studentIds.map(id => id.toString()));
      allowedIds = ids.filter(id => studentIds.includes(id));
    }
    // Admin: allowedIds = ids
    // Student: not allowed (optional: you can restrict further)

    const User = require('../models/User');
    const users = await User.find({ _id: { $in: allowedIds }, role: 'student' }).select('name email _id');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 
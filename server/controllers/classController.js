const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const { adminScopedQuery, attachAdminId } = require('../utils/adminQueryHelper');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private/Admin,Teacher
exports.getClasses = async (req, res) => {
  try {
    let query = {};
    
    // If user is a teacher, only show their classes
    if (req.user.role === 'teacher') {
      query.teacherId = req.user.roleId;
    }

    const classes = await adminScopedQuery(Class, req, query)
      .populate('teacherId', 'name email')
      .populate('adminId', 'name email')
      .populate('studentIds', 'name email');

    res.json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Private/Admin,Teacher
exports.getClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('teacherId', 'name email')
      .populate('adminId', 'name email')
      .populate('studentIds', 'name email');

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    res.json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new class
// @route   POST /api/classes
// @access  Private/Admin
exports.createClass = async (req, res) => {
  try {
    const { className, subjectName, teacherId } = req.body;

    // Check if teacher exists and belongs to the same admin
    const teacher = await Teacher.findOne({ _id: teacherId, adminId: req.user.roleId });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found in your organization'
      });
    }

    const classData = await Class.create(attachAdminId(req, {
      className,
      subjectName,
      teacherId,
      studentIds: []
    }));

    res.status(201).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private/Admin
exports.updateClass = async (req, res) => {
  try {
    const { className, subjectName, teacherId } = req.body;

    // Check if teacher exists if being updated
    if (teacherId) {
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          error: 'Teacher not found'
        });
      }
    }

    const classData = await Class.findByIdAndUpdate(
      req.params.id,
      {
        className,
        subjectName,
        teacherId
      },
      { new: true, runValidators: true }
    );

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    res.json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private/Admin
exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    await classData.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Add student to class
// @route   POST /api/classes/:id/students
// @access  Private/Admin,Teacher
exports.addStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    // Check if student is already enrolled
    if (classData.studentIds.includes(studentId)) {
      return res.status(400).json({
        success: false,
        error: 'Student is already enrolled in this class'
      });
    }

    classData.studentIds.push(studentId);
    await classData.save();

    res.json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Remove student from class
// @route   DELETE /api/classes/:id/students/:studentId
// @access  Private/Admin,Teacher
exports.removeStudent = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    // Remove student from class
    classData.studentIds = classData.studentIds.filter(
      id => id.toString() !== req.params.studentId
    );

    await classData.save();

    res.json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 
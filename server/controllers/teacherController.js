const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { adminScopedQuery, attachAdminId } = require('../utils/adminQueryHelper');

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private/Admin
exports.getTeachers = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    const query = includeInactive === 'true' ? {} : { isActive: true };
    const teachers = await adminScopedQuery(Teacher, req, query).select('-password');
    res.json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single teacher
// @route   GET /api/teachers/:id
// @access  Private/Admin
exports.getTeacher = async (req, res) => {
  try {
    const teacher = await adminScopedQuery(Teacher, req, { _id: req.params.id }).select('-password');
    if (!teacher || teacher.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }
    res.json({
      success: true,
      data: teacher[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new teacher
// @route   POST /api/teachers
// @access  Private/Admin
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password, age, extraDetails } = req.body;
    const teacherExists = await adminScopedQuery(Teacher, req, { email }).select('_id');
    if (teacherExists.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }
    const teacher = await Teacher.create(attachAdminId(req, {
      name,
      email,
      password,
      age,
      extraDetails
    }));
    res.status(201).json({
      success: true,
      data: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        age: teacher.age,
        extraDetails: teacher.extraDetails
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private/Admin
exports.updateTeacher = async (req, res) => {
  try {
    const { name, email, password, age, extraDetails } = req.body;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    const adminId = req.user._id;

    if (email) {
      const teacherExists = await Teacher.findOne({ email, _id: { $ne: req.params.id }, adminId });
      if (teacherExists) {
        return res.status(400).json({ success: false, error: 'Email already exists' });
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(age && { age }),
      ...(extraDetails && { extraDetails })
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, adminId },
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher) {
      return res.status(404).json({ success: false, error: 'Teacher not found in your organization' });
    }

    res.json({ success: true, data: teacher });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete teacher (soft delete)
// @route   DELETE /api/teachers/:id
// @access  Private/Admin
exports.deleteTeacher = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    const adminId = req.user._id;

    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, adminId },
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!teacher) {
      return res.status(404).json({ success: false, error: 'Teacher not found in your organization' });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update teacher and corresponding user
// @route   PUT /api/teachers/:id/full
// @access  Private/Admin
exports.updateTeacherFull = async (req, res) => {
  try {
    const { name, email, password, age, extraDetails } = req.body;

    // Check if email is being changed and if it already exists
    if (email) {
      const teacherExists = await Teacher.findOne({ email, _id: { $ne: req.params.id } });
      if (teacherExists) {
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
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    // Update Teacher
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }

    // Update corresponding User
    const userUpdate = {
      ...(name && { name }),
      ...(email && { email }),
      ...(typeof age !== 'undefined' && { age }),
      ...(hashedPassword && { password: hashedPassword })
    };
    const user = await User.findOneAndUpdate(
      { role: 'teacher', roleId: req.params.id },
      userUpdate,
      { new: true }
    );

    res.json({
      success: true,
      data: { teacher, user }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete teacher and corresponding user (soft delete)
// @route   DELETE /api/teachers/:id/full
// @access  Private/Admin
exports.deleteTeacherFull = async (req, res) => {
  try {
    // Soft delete Teacher
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }

    // Soft delete corresponding User
    const user = await User.findOneAndUpdate(
      { role: 'teacher', roleId: req.params.id },
      { isActive: false },
      { new: true }
    );

    res.json({
      success: true,
      data: { teacher, user }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 
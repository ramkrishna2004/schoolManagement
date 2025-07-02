const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register Teacher
exports.registerTeacher = async (req, res) => {
  try {
    console.log('REGISTER req.user:', req.user);
    console.log('CHECK:', !req.user, req.user && req.user.role);
    if (!req.user || req.user.role !== 'admin') {
      console.log('FAILED ADMIN CHECK');
      return res.status(403).json({
        success: false,
        error: 'Only admins can register teachers.'
      });
    }
    console.log('PASSED ADMIN CHECK');
    const { name, email, password, age, extraDetails } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }
    const teacher = await Teacher.create({
      name,
      email,
      age,
      extraDetails: {
        contact: extraDetails.contact,
        qualifications: extraDetails.qualifications
      },
      adminId: req.user.roleId
    });
    const user = await User.create({
      name,
      email,
      password,
      role: 'teacher',
      roleId: teacher._id
    });
    const token = generateToken(user._id, 'teacher');
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        teacherDetails: teacher,
        token
      }
    });
  } catch (error) {
    console.error('Teacher registration error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Register Student
exports.registerStudent = async (req, res) => {
  try {
    console.log('REGISTER req.user:', req.user);
    console.log('CHECK:', !req.user, req.user && req.user.role);
    if (!req.user || req.user.role !== 'admin') {
      console.log('FAILED ADMIN CHECK');
      return res.status(403).json({
        success: false,
        error: 'Only admins can register students.'
      });
    }
    console.log('PASSED ADMIN CHECK');
    const { name, email, password, age, extraDetails, rollno } = req.body;
    if (!rollno) {
      return res.status(400).json({
        success: false,
        error: 'Roll number is required'
      });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { rollno }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
      } else {
        return res.status(400).json({
          success: false,
          error: 'Roll number already exists'
        });
      }
    }
    const student = await Student.create({
      name,
      email,
      age,
      extraDetails,
      adminId: req.user.roleId
    });
    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      roleId: student._id,
      rollno
    });
    const token = generateToken(user._id, 'student');
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentDetails: student,
        token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, age, extraDetails } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Create admin record
    const admin = await Admin.create({
      name,
      email,
      age,
      extraDetails: {
        contact: extraDetails.contact,
        department: extraDetails.department
      }
    });

    // Create user record with reference to admin
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      roleId: admin._id
    });

    const token = generateToken(user._id, 'admin');

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminDetails: admin,
        token
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, rollno, password } = req.body;
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (rollno) {
      user = await User.findOne({ rollno });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Email or Roll number is required'
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Get role-specific details
    let roleDetails = null;
    if (user.role === 'admin') {
      roleDetails = await Admin.findById(user.roleId);
      if (!roleDetails) {
        return res.status(401).json({
          success: false,
          error: 'Role details not found'
        });
      }
    } else if (user.role === 'teacher') {
      roleDetails = await Teacher.findById(user.roleId);
      if (!roleDetails) {
        return res.status(401).json({
          success: false,
          error: 'Role details not found'
        });
      }
    } else if (user.role === 'student') {
      roleDetails = await Student.findById(user.roleId);
      if (!roleDetails) {
        return res.status(401).json({
          success: false,
          error: 'Role details not found'
        });
      }
    } else if (user.role === 'superadmin') {
      // No roleDetails for superadmin
      roleDetails = null;
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roleDetails,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
};

// Get current logged in user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let roleDetails;

    if (user.role === 'admin') {
      roleDetails = await Admin.findById(user.roleId);
    } else if (user.role === 'teacher') {
      roleDetails = await Teacher.findById(user.roleId);
    } else if (user.role === 'student') {
      roleDetails = await Student.findById(user.roleId);
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roleDetails
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user._id;

    // Update user record
    const user = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update role-specific record
    let roleDetails;
    if (user.role === 'admin') {
      roleDetails = await Admin.findByIdAndUpdate(
        user.roleId,
        { adminName: name },
        { new: true }
      );
    } else if (user.role === 'teacher') {
      roleDetails = await Teacher.findByIdAndUpdate(
        user.roleId,
        { name },
        { new: true }
      );
    } else if (user.role === 'student') {
      roleDetails = await Student.findByIdAndUpdate(
        user.roleId,
        { name },
        { new: true }
      );
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        roleDetails
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 
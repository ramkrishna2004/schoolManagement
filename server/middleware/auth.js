const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log('Protect middleware - Received token:', token);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded JWT:', decoded);

      // Get user from token
      const user = await User.findById(decoded.id);
      console.log('User found from token:', user);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      // --- Start: Multi-tenancy Enrichment ---
      let adminId;
      let roleDetails;

      if (user.role === 'superadmin') {
        // Superadmin does not have adminId or roleDetails
        req.user = user;
        return next();
      }

      if (user.role === 'admin') {
        adminId = user.roleId;
        roleDetails = await Admin.findById(user.roleId);
      } else if (user.role === 'teacher') {
        roleDetails = await Teacher.findById(user.roleId);
        if (roleDetails) {
          adminId = roleDetails.adminId;
        }
      } else if (user.role === 'student') {
        roleDetails = await Student.findById(user.roleId);
        if (roleDetails) {
          adminId = roleDetails.adminId;
        }
      }

      if (!adminId || !roleDetails) {
        return res.status(403).json({ success: false, error: 'User role information is incomplete or invalid.' });
      }

      // Attach user, adminId, and role-specific details to request
      req.user = user;
      req.user.adminId = adminId;
      req.user.roleDetails = roleDetails;
      // --- End: Multi-tenancy Enrichment ---

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during authentication'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorize middleware - req.user.role:', req.user ? req.user.role : 'none', '| Allowed roles:', roles);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user ? req.user.role : 'none'} is not authorized to access this route`
      });
    }
    next();
  };
}; 
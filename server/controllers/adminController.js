const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// @desc    Get all admins
// @route   GET /api/admins
// @access  Private/Admin
exports.getAdmins = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    const query = includeInactive === 'true' ? {} : { isActive: true };

    const admins = await Admin.find(query).select('-password');
    res.json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single admin
// @route   GET /api/admins/:id
// @access  Private/Admin
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found'
      });
    }

    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new admin
// @route   POST /api/admins
// @access  Private/Admin
exports.createAdmin = async (req, res) => {
  try {
    const { adminName, email, password, organizationName } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    const admin = await Admin.create({
      adminName,
      email,
      password,
      organizationName
    });

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        adminName: admin.adminName,
        email: admin.email,
        organizationName: admin.organizationName
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update admin
// @route   PUT /api/admins/:id
// @access  Private/Admin
exports.updateAdmin = async (req, res) => {
  try {
    const { adminName, email, password, organizationName } = req.body;

    // Check if email is being changed and if it already exists
    if (email) {
      const adminExists = await Admin.findOne({ email, _id: { $ne: req.params.id } });
      if (adminExists) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
      }
    }

    const updateData = {
      ...(adminName && { adminName }),
      ...(email && { email }),
      ...(organizationName && { organizationName })
    };

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found'
      });
    }

    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete admin (soft delete)
// @route   DELETE /api/admins/:id
// @access  Private/Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found'
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
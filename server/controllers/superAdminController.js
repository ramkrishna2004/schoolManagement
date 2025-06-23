const User = require('../models/User');
const Admin = require('../models/Admin');
const mongoose = require('mongoose');

// @desc    Get all admin users
// @route   GET /api/superadmin/admins
// @access  Private/Superadmin
exports.listAdmins = async (req, res) => {
  try {
    // Find all users with the 'admin' role
    const admins = await User.find({ role: 'admin' }).populate({
      path: 'roleId',
      model: 'Admin'
    });

    res.json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`
    });
  }
};

// @desc    Delete an admin
// @route   DELETE /api/superadmin/admins/:id
// @access  Private/Superadmin
exports.deleteAdmin = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.params.id;

    // Find the user to be deleted
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.role !== 'admin') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, error: 'User is not an admin' });
    }

    const adminId = user.roleId;

    // 1. Delete the Admin document
    if (adminId) {
      const adminDeleteResult = await Admin.findByIdAndDelete(adminId).session(session);
      if (!adminDeleteResult) {
        // Log this, but don't abort, as the user record should still be deleted
        console.warn(`Admin record with ID ${adminId} not found for user ${userId}, but proceeding with user deletion.`);
      }
    }

    // 2. Delete the User document
    await User.findByIdAndDelete(userId).session(session);
    
    // Note: Cascading deletion of all of the admin's data (students, teachers, classes, etc.)
    // is a complex operation that should be handled here if required.
    // For now, we are just deleting the admin's own records.

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`
    });
  }
}; 
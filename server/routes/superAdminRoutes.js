const express = require('express');
const router = express.Router();
const { listAdmins, deleteAdmin } = require('../controllers/superAdminController');
const { protect, authorize } = require('../middleware/auth');

// All routes in this file are protected and for superadmin only
router.use(protect);
router.use(authorize('superadmin'));

// @route   GET /api/superadmin/admins
// @desc    Get all admins
// @access  Private/Superadmin
router.get('/admins', listAdmins);

// @route   DELETE /api/superadmin/admins/:id
// @desc    Delete an admin and their associated user account
// @access  Private/Superadmin
router.delete('/admins/:id', deleteAdmin);

module.exports = router; 
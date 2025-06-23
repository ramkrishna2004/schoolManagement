const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

// Create announcement (admin only)
router.post('/', protect, authorize('admin'), announcementController.createAnnouncement);
// Get all announcements (filtered by user)
router.get('/', protect, announcementController.getAnnouncements);
// Get single announcement
router.get('/:id', protect, announcementController.getAnnouncement);
// Update announcement (admin only)
router.put('/:id', protect, authorize('admin'), announcementController.updateAnnouncement);
// Delete announcement (admin only)
router.delete('/:id', protect, authorize('admin'), announcementController.deleteAnnouncement);

module.exports = router; 
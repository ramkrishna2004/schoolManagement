const Announcement = require('../models/Announcement');
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const { adminScopedQuery, attachAdminId } = require('../utils/adminQueryHelper');

// Create announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, target, visibleFrom, visibleTo, isActive } = req.body;
    const announcement = new Announcement(attachAdminId(req, {
      title,
      message,
      createdBy: req.user.roleId,
      target,
      visibleFrom,
      visibleTo,
      isActive
    }));
    await announcement.save();
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get announcements (filtered by user role)
exports.getAnnouncements = async (req, res) => {
  try {
    const now = new Date();
    let filter = { isActive: true };
    
    // For regular users, only show announcements that are currently visible
    if (req.user.role !== 'admin' || req.query.includeInactive !== 'true') {
      filter.$and = [
        { isActive: true },
        {
          $or: [
            { visibleFrom: { $exists: false } },
            { visibleFrom: null },
            { visibleFrom: { $lte: now } }
          ]
        },
        {
          $or: [
            { visibleTo: { $exists: false } },
            { visibleTo: null },
            { visibleTo: { $gt: now } }
          ]
        }
      ];
    }

    // Filter by target audience
    if (req.user.role === 'student') {
      filter.$or = [
        { target: 'all' },
        { target: 'students' }
      ];
    } else if (req.user.role === 'teacher') {
      filter.$or = [
        { target: 'all' },
        { target: 'teachers' }
      ];
    }

    // Use adminScopedQuery to ensure adminId filtering
    const announcements = await adminScopedQuery(Announcement, req, filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single announcement
exports.getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate('createdBy', 'name email');
    if (!announcement) return res.status(404).json({ success: false, error: 'Announcement not found' });
    res.json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, message, target, visibleFrom, visibleTo, isActive } = req.body;
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, message, target, visibleFrom, visibleTo, isActive },
      { new: true }
    );
    if (!announcement) return res.status(404).json({ success: false, error: 'Announcement not found' });
    res.json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, error: 'Announcement not found' });
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 
const Diary = require('../models/Diary');
const Class = require('../models/Class');
const { adminScopedQuery, attachAdminId } = require('../utils/adminQueryHelper');

// Create a new diary entry
exports.createDiary = async (req, res) => {
  try {
    const { classId, entries, date } = req.body;
    const user = req.user;
    let createdByRole;
    if (user.role === 'teacher') createdByRole = 'Teacher';
    else if (user.role === 'admin') createdByRole = 'Admin';
    else return res.status(403).json({ message: 'Unauthorized' });

    // Teachers can only create for their assigned classes
    if (user.role === 'teacher') {
      const classObj = await Class.findById(classId);
      if (!classObj || String(classObj.teacherId) !== String(user.roleId)) {
        return res.status(403).json({ message: 'Not your class' });
      }
    }

    // Attach adminId to the diary data
    const diary = await Diary.create(attachAdminId(req, {
      classId,
      createdBy: user.roleId,
      createdByRole,
      entries,
      date
    }));
    res.status(201).json(diary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get diaries for a class
exports.getDiaries = async (req, res) => {
  try {
    const user = req.user;
    let { classId, date, page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    if (user.role === 'student') {
      const classObj = await Class.findOne({ studentIds: user.roleId });
      if (!classObj) return res.status(200).json({ diaries: [], totalPages: 0, currentPage: 1 });
      classId = classObj._id;
    }
    
    if (!classId) return res.status(400).json({ message: 'classId is required for this role' });

    let query = { classId };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    // Use adminScopedQuery to ensure adminId filtering
    const totalDiaries = await adminScopedQuery(Diary, req, query).countDocuments();
    const diaries = await adminScopedQuery(Diary, req, query)
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip);
      
    res.json({
      diaries,
      totalPages: Math.ceil(totalDiaries / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a diary
exports.updateDiary = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const diary = await Diary.findById(id);
    if (!diary) return res.status(404).json({ message: 'Diary not found' });
    
    if (user.role === 'admin' || (user.role === 'teacher' && String(diary.createdBy) === String(user.roleId))) {
      const { entries, date } = req.body;
      if (entries) diary.entries = entries;
      if (date) diary.date = date;
      await diary.save();
      res.json(diary);
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a diary
exports.deleteDiary = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const diary = await Diary.findById(id);
    if (!diary) return res.status(404).json({ message: 'Diary not found' });

    if (user.role === 'admin' || (user.role === 'teacher' && String(diary.createdBy) === String(user.roleId))) {
      await diary.deleteOne();
      res.json({ message: 'Diary deleted' });
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
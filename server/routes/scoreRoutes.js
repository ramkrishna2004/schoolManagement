const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const { protect, authorize } = require('../middleware/auth');
const { attachAdminId } = require('../utils/adminQueryHelper');

// Protect all routes
router.use(protect);

// Get all scores (with filtering)
router.get('/', authorize('admin', 'teacher', 'student'), async (req, res) => {
  try {
    let query = {};

    // Role-based filtering
    if (req.user.role === 'student') {
      // Students can only see their own scores
      query.studentId = req.user.roleId;
    } else if (req.user.role === 'teacher') {
      // Teachers can filter by class, test, or student
      // To prevent teachers from seeing scores outside their classes, we would need to
      // add a check here, e.g., based on the classes they teach.
      // For now, we allow filtering based on what's passed in the query.
      if (req.query.classId) query.classId = req.query.classId;
      if (req.query.studentId) query.studentId = req.query.studentId;
    }

    // General filtering for all roles
    if (req.query.testId) query.testId = req.query.testId;
    if (req.query.classId) query.classId = req.query.classId;

    // Enforce adminId scoping
    if (req.user.role === 'admin') {
      query.adminId = req.user.roleId;
    } else if (req.user.adminId) {
      query.adminId = req.user.adminId;
    }

    const scores = await Score.find(query)
      .populate('studentId', 'name email')
      .populate('testId', 'title subject')
      .populate('classId', 'className');
    res.json({
      success: true,
      data: scores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single score
router.get('/:id', authorize('admin', 'teacher', 'student'), async (req, res) => {
  try {
    // Enforce adminId scoping
    const adminId = req.user.role === 'admin' ? req.user.roleId : req.user.adminId;
    const score = await Score.findOne({ _id: req.params.id, adminId })
      .populate('studentId', 'name email')
      .populate('testId', 'title subject')
      .populate('classId', 'className');

    if (!score) {
      return res.status(404).json({
        success: false,
        error: 'Score not found'
      });
    }

    // Authorization check
    if (req.user.role === 'student' && score.studentId._id.toString() !== req.user.roleId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to view this score'
      });
    }

    res.json({
      success: true,
      data: score
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create score - Typically done when a test is submitted, so maybe admin/teacher only
router.post('/', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const score = await Score.create(attachAdminId(req, req.body));
    const populatedScore = await Score.findById(score._id)
      .populate('studentId', 'name email')
      .populate('testId', 'title subject')
      .populate('classId', 'className');

    res.status(201).json({
      success: true,
      data: populatedScore
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update score
router.put('/:id', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const score = await Score.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    .populate('studentId', 'name email')
    .populate('testId', 'title subject')
    .populate('classId', 'className');

    if (!score) {
      return res.status(404).json({
        success: false,
        error: 'Score not found'
      });
    }

    res.json({
      success: true,
      data: score
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete score
router.delete('/:id', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const score = await Score.findByIdAndDelete(req.params.id);
    if (!score) {
      return res.status(404).json({
        success: false,
        error: 'Score not found'
      });
    }
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
});

module.exports = router; 
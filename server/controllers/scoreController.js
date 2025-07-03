const Score = require('../models/Score');
const Test = require('../models/Test');
const Class = require('../models/Class');
const { attachAdminId } = require('../utils/adminQueryHelper');
const StudentTestAttempt = require('../models/StudentTestAttempt');

// @desc    Get all scores
// @route   GET /api/scores
// @access  Private/Teacher,Student,Admin
exports.getScores = async (req, res) => {
  try {
    let query = { isActive: true };
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    // If user is a student, only show their scores
    if (req.user.role === 'student') {
      query.studentId = req.user.roleId;
      // Further filter by classId if provided by the student
      if (req.query.classId) {
        query.classId = req.query.classId;
      }
    }
    // If user is a teacher, only show scores for their classes
    else if (req.user.role === 'teacher') {
      const teacherClasses = await Class.find({
        teacherId: req.user.roleId,
        isActive: true
      }).select('_id');
      
      query.classId = { $in: teacherClasses.map(c => c._id) };
    }

    // Filter by studentId, testId, or classId if provided (for admin/teacher)
    if (req.user.role !== 'student') {
      if (req.query.studentId) {
        query.studentId = req.query.studentId;
      }
      if (req.query.testId) {
        query.testId = req.query.testId;
      }
      if (req.query.classId) {
        query.classId = req.query.classId;
      }
    }

    // Add adminId scoping
    if (req.user.role === 'admin') {
      query.adminId = req.user.roleId;
    } else if (req.user.adminId) {
      query.adminId = req.user.adminId;
    }

    const total = await Score.countDocuments(query);
    const scores = await Score.find(query)
      .populate('studentId', 'name email')
      .populate('testId', 'title subject testType')
      .populate('classId', 'className subjectName')
      .sort('-submissionDate')
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: scores.length,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: scores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single score
// @route   GET /api/scores/:id
// @access  Private/Teacher,Student,Admin
exports.getScore = async (req, res) => {
  try {
    const score = await Score.findOne({
      _id: req.params.id,
      adminId: req.user.role === 'admin' ? req.user.roleId : req.user.adminId
    })
      .populate('studentId', 'name email')
      .populate('testId', 'title subject')
      .populate('classId', 'className subjectName');

    if (!score || !score.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Score not found'
      });
    }

    // Check if user has permission to view this score
    if (req.user.role === 'student' && score.studentId._id.toString() !== req.user.roleId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this score'
      });
    }
    if (req.user.role === 'teacher') {
      const isTeacherOfClass = await Class.findOne({
        _id: score.classId._id,
        teacherId: req.user.roleId,
        isActive: true
      });
      
      if (!isTeacherOfClass) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to view this score'
        });
      }
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
};

// @desc    Submit test answers and create score
// @route   POST /api/scores
// @access  Private/Student
exports.submitTest = async (req, res) => {
  try {
    const { testId, classId, answers } = req.body;

    // Verify test exists
    const test = await Test.findOne({
      _id: testId,
      isActive: true
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }

    // Verify student is enrolled in the class
    const classData = await Class.findOne({
      _id: classId,
      studentIds: req.user.roleId,
      isActive: true
    });

    if (!classData) {
      return res.status(403).json({
        success: false,
        error: 'You are not enrolled in this class'
      });
    }

    // Check for existing submission
    const existingScore = await Score.findOne({
      studentId: req.user.roleId,
      testId,
      isActive: true
    });

    if (existingScore) {
      return res.status(400).json({
        success: false,
        error: 'You have already submitted this test'
      });
    }

    // Calculate score by comparing answers
    let correctAnswers = 0;
    const totalQuestions = Object.keys(test.answers).length;

    for (const [questionNumber, question] of Object.entries(test.answers)) {
      if (answers[questionNumber] === question.correctAnswer) {
        correctAnswers++;
      }
    }

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Create score record
    const scoreRecord = await Score.create(attachAdminId(req, {
      studentId: req.user.roleId,
      testId,
      classId,
      score,
      obtainedMarks: correctAnswers,
      totalMarks: totalQuestions,
      isActive: true
    }));

    res.status(201).json({
      success: true,
      data: scoreRecord
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update score
// @route   PUT /api/scores/:id
// @access  Private/Admin
exports.updateScore = async (req, res) => {
  try {
    const { score } = req.body;

    const scoreRecord = await Score.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!scoreRecord) {
      return res.status(404).json({
        success: false,
        error: 'Score not found'
      });
    }

    scoreRecord.score = score;
    await scoreRecord.save();

    res.json({
      success: true,
      data: scoreRecord
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete score (soft delete)
// @route   DELETE /api/scores/:id
// @access  Private/Admin
exports.deleteScore = async (req, res) => {
  try {
    const score = await Score.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!score) {
      return res.status(404).json({
        success: false,
        error: 'Score not found'
      });
    }

    // Soft delete by setting isActive to false
    score.isActive = false;
    await score.save();

    // Also soft delete the corresponding StudentTestAttempt
    await StudentTestAttempt.findOneAndUpdate(
      { studentId: score.studentId, testId: score.testId, isActive: true },
      { isActive: false }
    );

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

// @desc    Get class leaderboard
// @route   GET /api/classes/:classId/leaderboard
// @access  Private/Teacher,Student
exports.getClassLeaderboard = async (req, res) => {
  try {
    const { classId } = req.params;

    // Verify class exists
    const classData = await Class.findOne({
      _id: classId,
      isActive: true
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    // Check if user has permission to view this leaderboard
    if (req.user.role === 'student') {
      const isEnrolled = classData.studentIds.includes(req.user.roleId);
      if (!isEnrolled) {
        return res.status(403).json({
          success: false,
          error: 'You are not enrolled in this class'
        });
      }
    } else if (req.user.role === 'teacher') {
      if (classData.teacherId.toString() !== req.user.roleId.toString()) {
        return res.status(403).json({
          success: false,
          error: 'You are not assigned to this class'
        });
      }
    }

    // Get all scores for the class, sorted by score in descending order
    const scores = await Score.find({
      classId,
      isActive: true,
      adminId: req.user.role === 'admin' ? req.user.roleId : req.user.adminId
    })
      .populate('studentId', 'name email')
      .populate('testId', 'testTitle subjectName')
      .sort({ score: -1 });

    res.json({
      success: true,
      count: scores.length,
      data: scores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 
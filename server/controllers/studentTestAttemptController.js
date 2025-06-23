const StudentTestAttempt = require('../models/StudentTestAttempt');
const Test = require('../models/Test');
const Class = require('../models/Class');
const Question = require('../models/Question');
const asyncHandler = require('express-async-handler');
const Score = require('../models/Score');
const { attachAdminId } = require('../utils/adminQueryHelper');

// @desc    Start a test attempt
// @route   POST /api/tests/:testId/attempts/start
// @access  Private/Student
const startTestAttempt = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const studentId = req.user.roleId;

  const test = await Test.findById(testId);
  if (!test || !test.isActive) {
    res.status(404);
    throw new Error('Test not found or not active');
  }

  // Check for any existing attempt by this student for this test
  const existingAttempt = await StudentTestAttempt.findOne({ studentId, testId });

  if (existingAttempt) {
    switch (existingAttempt.status) {
      case 'completed':
      case 'evaluated':
        res.status(400);
        throw new Error('You have already completed this test. View your results.');
      case 'in-progress':
        // Allow resuming the ongoing attempt
        return res.status(200).json({
      success: true,
      message: 'Resuming existing test attempt',
          data: existingAttempt
    });
      case 'expired':
        res.status(403);
        throw new Error('Your previous attempt for this test has expired.');
      default:
        // Fallback for any other statuses
        res.status(500);
        throw new Error('An unexpected status was found for your test attempt.');
    }
  } else {
    // No previous attempt found, so create a new one
    const newAttempt = await StudentTestAttempt.create(attachAdminId(req, {
      studentId,
      testId,
      adminId: test.adminId,
      classId: test.classId,
      startTime: new Date(),
      status: 'in-progress'
    }));

    res.status(201).json({
      success: true,
      data: newAttempt
    });
  }
});

// @desc    Get a student's test attempt
// @route   GET /api/tests/:testId/attempts
// @access  Private/Student
const getStudentTestAttempt = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const studentId = req.user.roleId; // Use Student _id (roleId)

  const attempt = await StudentTestAttempt.findOne({ studentId, testId, isActive: true });

  if (!attempt) {
    res.status(404);
    throw new Error('Test attempt not found');
  }

  // Basic authorization check: ensure the attempt belongs to the logged-in student
  if (attempt.studentId.toString() !== studentId.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this test attempt');
  }

  res.status(200).json({
    success: true,
    data: attempt
  });
});

// @desc    Submit test attempt (manual or auto-submission)
// @route   PUT /api/tests/:testId/attempts/submit
// @access  Private/Student
const submitTestAttempt = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const studentId = req.user.roleId; // Use Student _id (roleId)
  const { submittedAnswers } = req.body;

  let attempt = await StudentTestAttempt.findOne({ studentId, testId, isActive: true, status: 'in-progress' });

  if (!attempt) {
    res.status(404);
    throw new Error('Active test attempt not found');
  }

  const test = await Test.findById(testId);
  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  const questions = await Question.find({ testId, isActive: true });

  let obtainedMarks = 0;
  const updatedSubmittedAnswers = new Map(submittedAnswers ? Object.entries(submittedAnswers) : []);

  questions.forEach(q => {
    if (q.type === 'MCQ') {
      const studentAnswer = updatedSubmittedAnswers.get(q._id.toString());
      if (studentAnswer && studentAnswer === q.correctAnswer) {
        obtainedMarks += q.marks;
      }
    }
    // Descriptive questions will need manual grading, so their marks are not added here
  });

  const totalMarks = test.totalMarks;
  const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;

  attempt.submittedAnswers = updatedSubmittedAnswers;
  attempt.endTime = new Date();
  attempt.score = percentage;
  attempt.status = 'completed';

  await attempt.save();

  // Create or update Score record
  await Score.findOneAndUpdate(
    { studentId, testId },
    attachAdminId(req, {
      studentId,
      testId,
      classId: test.classId,
      score: percentage,
      obtainedMarks,
      totalMarks,
      submissionDate: new Date(),
      isActive: true
    }),
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({
    success: true,
    data: attempt
  });
});

module.exports = {
  startTestAttempt,
  getStudentTestAttempt,
  submitTestAttempt
}; 
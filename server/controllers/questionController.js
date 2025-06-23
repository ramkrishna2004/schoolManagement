const Question = require('../models/Question');
const Test = require('../models/Test');
const asyncHandler = require('express-async-handler');
const { adminScopedQuery, attachAdminId } = require('../utils/adminQueryHelper');

// @desc    Get all questions for a test
// @route   GET /api/tests/:testId/questions
// @access  Private/Admin,Teacher
const getQuestions = asyncHandler(async (req, res) => {
  // Student role bypass - they can see questions if they can take the test
  if (req.user.role === 'student') {
    const test = await Test.findById(req.params.testId);
    if (!test || !test.isActive) {
      res.status(404);
      throw new Error('Test not found or not active');
    }
    const questions = await Question.find({ testId: req.params.testId, isActive: true });
    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  }

  // Existing logic for Admin/Teacher
  const [test] = await adminScopedQuery(Test, req, { _id: req.params.testId });
  
  if (!test) {
    res.status(404);
    throw new Error('Test not found in your organization');
  }

  // Check if user has permission to view questions
  if (req.user.role === 'teacher' && test.teacherId.toString() !== req.user.roleId.toString()) {
    res.status(403);
    throw new Error('Not authorized to view these questions');
  }

  const questions = await adminScopedQuery(Question, req, {
    testId: req.params.testId,
    isActive: true
  }).sort('createdAt');

  res.status(200).json({
    success: true,
    count: questions.length,
    data: questions
  });
});

// @desc    Get single question
// @route   GET /api/tests/:testId/questions/:id
// @access  Private/Admin,Teacher
const getQuestion = asyncHandler(async (req, res) => {
  const [test] = await adminScopedQuery(Test, req, { _id: req.params.testId });
  
  if (!test) {
    res.status(404);
    throw new Error('Test not found in your organization');
  }

  // Check if user has permission to view questions
  if (req.user.role === 'teacher' && test.teacherId.toString() !== req.user.roleId.toString()) {
    res.status(403);
    throw new Error('Not authorized to view these questions');
  }

  const [question] = await adminScopedQuery(Question, req, {
    _id: req.params.id,
    testId: req.params.testId,
    isActive: true
  });

  if (!question) {
    res.status(404);
    throw new Error('Question not found in your organization');
  }

  res.status(200).json({
    success: true,
    data: question
  });
});

// @desc    Create question
// @route   POST /api/tests/:testId/questions
// @access  Private/Admin,Teacher
const createQuestion = asyncHandler(async (req, res) => {
  const [test] = await adminScopedQuery(Test, req, { _id: req.params.testId });
  
  if (!test) {
    res.status(404);
    throw new Error('Test not found in your organization');
  }

  // Check if user has permission to create questions
  if (req.user.role === 'teacher' && test.teacherId.toString() !== req.user.roleId.toString()) {
    res.status(403);
    throw new Error('Not authorized to create questions for this test');
  }

  // Add testId and createdBy to request body
  req.body.testId = req.params.testId;
  req.body.createdBy = req.user._id;

  const questionData = attachAdminId(req, req.body);
  const question = await Question.create(questionData);

  res.status(201).json({
    success: true,
    data: question
  });
});

// @desc    Update question
// @route   PUT /api/tests/:testId/questions/:id
// @access  Private/Admin,Teacher
const updateQuestion = asyncHandler(async (req, res) => {
  const [test] = await adminScopedQuery(Test, req, { _id: req.params.testId });
  
  if (!test) {
    res.status(404);
    throw new Error('Test not found in your organization');
  }

  // Check if user has permission to update questions
  if (req.user.role === 'teacher' && test.teacherId.toString() !== req.user.roleId.toString()) {
    res.status(403);
    throw new Error('Not authorized to update questions for this test');
  }

  const [question] = await adminScopedQuery(Question, req, {
    _id: req.params.id,
    testId: req.params.testId,
    isActive: true
  });

  if (!question) {
    res.status(404);
    throw new Error('Question not found in your organization');
  }

  // Update question
  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: updatedQuestion
  });
});

// @desc    Delete question (soft delete)
// @route   DELETE /api/tests/:testId/questions/:id
// @access  Private/Admin,Teacher
const deleteQuestion = asyncHandler(async (req, res) => {
  const [test] = await adminScopedQuery(Test, req, { _id: req.params.testId });
  
  if (!test) {
    res.status(404);
    throw new Error('Test not found in your organization');
  }

  // Check if user has permission to delete questions
  if (req.user.role === 'teacher' && test.teacherId.toString() !== req.user.roleId.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete questions for this test');
  }

  const [question] = await adminScopedQuery(Question, req, {
    _id: req.params.id,
    testId: req.params.testId,
    isActive: true
  });

  if (!question) {
    res.status(404);
    throw new Error('Question not found in your organization');
  }

  // Soft delete by setting isActive to false
  question.isActive = false;
  await question.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
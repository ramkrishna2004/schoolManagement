const Test = require('../models/Test');
const Class = require('../models/Class');
const asyncHandler = require('express-async-handler');
const StudentTestAttempt = require('../models/StudentTestAttempt');
const Student = require('../models/Student');

// @desc    Get all tests
// @route   GET /api/tests
// @access  Private/Admin,Teacher,Student
const getTests = asyncHandler(async (req, res) => {
  let query = { isActive: true };
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  
  // If user is a teacher, only show their tests
  if (req.user.role === 'teacher') {
    query.teacherId = req.user.roleId;
  }
  // If user is a student, only show tests for their enrolled classes
  else if (req.user.role === 'student') {
    const enrolledClasses = await Class.find({
      studentIds: req.user.roleId
    }).select('_id');
    query.classId = { $in: enrolledClasses.map(c => c._id) };
  }
  // Admin can see all tests, no additional query needed

  if (req.query.classId) {
    query.classId = req.query.classId;
  }

  if (req.user.role === 'admin') query.adminId = req.user.roleId;
  else if (req.user.adminId) query.adminId = req.user.adminId;

  const total = await Test.countDocuments(query);
  let tests = await Test.find(query)
    .populate('teacherId', 'name email')
    .populate('classId', 'className subjectName')
    .sort('-createdAt')
    .skip(skip)
    .limit(limitNum);

  // For students, enrich test data with their attempt status (only for current page)
  if (req.user.role === 'student') {
    tests = await Promise.all(tests.map(async (test) => {
      const attempt = await StudentTestAttempt.findOne({
        studentId: req.user.roleId,
        testId: test._id,
        isActive: true
      }).lean();
      return { ...test.toObject(), myAttempt: attempt || null };
    }));
  }

  res.status(200).json({
    success: true,
    count: tests.length,
    total,
    currentPage: pageNum,
    totalPages: Math.ceil(total / limitNum),
    data: tests
  });
});

// @desc    Get single test
// @route   GET /api/tests/:id
// @access  Private/Admin,Teacher,Student
const getTest = asyncHandler(async (req, res) => {
  let test;
  try {
    test = await Test.findById(req.params.id)
    .populate('teacherId', 'name email')
    .populate('classId', 'className subjectName');
  } catch (err) {
    return res.status(404).json({ success: false, error: 'Test not found or data is corrupted.' });
  }

  if (!test || !test.isActive) {
    return res.status(404).json({ success: false, error: 'Test not found' });
  }

  // Defensive: If class or teacher is missing after population, treat as not found
  if (!test.classId || !test.teacherId) {
    return res.status(404).json({ success: false, error: 'Test data is incomplete or corrupted (missing class or teacher).' });
  }

  // Check if user has permission to view this test
  if (req.user.role === 'student') {
    const isEnrolled = await Class.findOne({ _id: test.classId._id || test.classId, studentIds: req.user.roleId });
    if (!isEnrolled) {
      return res.status(403).json({ success: false, error: 'Not authorized to view this test' });
    }
  }
  // Admin and teacher can view any test, no additional check needed

  res.status(200).json({
    success: true,
    data: test
  });
});

// @desc    Create test
// @route   POST /api/tests
// @access  Private/Admin,Teacher
const createTest = asyncHandler(async (req, res) => {
  const { 
    testTitle, 
    subjectName, 
    classId, 
    type,
    totalMarks,
    passingMarks,
    duration,
    scheduledDate,
    startTime,
    endTime
  } = req.body;

  // First, find the class without any restrictions
  const classData = await Class.findById(classId);

  if (!classData) {
    res.status(404);
    throw new Error('Class not found');
  }

  // If user is a teacher, verify they are assigned to the class
  if (req.user.role === 'teacher') {
    if (classData.teacherId?.toString() !== req.user.roleId.toString()) {
      res.status(403);
      throw new Error('You are not assigned to this class');
    }
  }

  // Create test
  const test = await Test.create({
    title: testTitle,
    type,
    subject: subjectName,
    classId,
    teacherId: req.user.role === 'admin' ? classData.teacherId : req.user.roleId,
    totalMarks,
    passingMarks,
    duration,
    scheduledDate,
    startTime,
    endTime,
    createdBy: req.user._id,
    adminId: req.user.role === 'admin' ? req.user.roleId : req.user.adminId,
    testType: 'online',
    isActive: true
  });

  res.status(201).json({
    success: true,
    data: test
  });
});

// @desc    Update test
// @route   PUT /api/tests/:id
// @access  Private/Admin,Teacher
const updateTest = asyncHandler(async (req, res) => {
  const { 
    testTitle, 
    subjectName, 
    classId, 
    type,
    totalMarks,
    passingMarks,
    duration,
    scheduledDate,
    startTime,
    endTime
  } = req.body;

  // Find the test
  const test = await Test.findOne({
    _id: req.params.id,
    isActive: true
  });

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  // Check authorization
  if (req.user.role === 'teacher' && test.teacherId?.toString() !== req.user.roleId.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this test');
  }

  // If classId is being updated, verify the new class exists
  if (classId && classId !== test.classId.toString()) {
    const classData = await Class.findOne({
      _id: classId,
      isActive: true
    });

    if (!classData) {
      res.status(404);
      throw new Error('Class not found');
    }

    // If user is a teacher, verify they are assigned to the new class
    if (req.user.role === 'teacher' && classData.teacherId?.toString() !== req.user.roleId.toString()) {
      res.status(403);
      throw new Error('You are not assigned to this class');
    }
  }

  // Update test fields
  const updateData = {
    ...(testTitle && { title: testTitle }),
    ...(type && { type }),
    ...(subjectName && { subject: subjectName }),
    ...(classId && { classId }),
    ...(totalMarks && { totalMarks: parseInt(totalMarks) }),
    ...(passingMarks && { passingMarks: parseInt(passingMarks) }),
    ...(duration && { duration: parseInt(duration) }),
    ...(scheduledDate && { scheduledDate }),
    ...(startTime && { startTime }),
    ...(endTime && { endTime })
  };

  const updatedTest = await Test.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).populate('teacherId', 'name email')
   .populate('classId', 'className subjectName');

  res.status(200).json({
    success: true,
    data: updatedTest
  });
});

// @desc    Delete test (soft delete)
// @route   DELETE /api/tests/:id
// @access  Private/Admin,Teacher
const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findOne({
    _id: req.params.id,
    isActive: true
  });

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  // Check authorization
  if (req.user.role === 'teacher' && test.teacherId.toString() !== req.user.roleId.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this test');
  }

  // Soft delete by setting isActive to false
  test.isActive = false;
  await test.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getTests,
  getTest,
  createTest,
  updateTest,
  deleteTest
}; 
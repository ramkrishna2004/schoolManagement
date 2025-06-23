const Schedule = require('../models/Schedule');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { attachAdminId, adminScopedQuery } = require('../utils/adminQueryHelper');

// @desc    Get all schedules
// @route   GET /api/schedules
// @access  Private
exports.getSchedules = asyncHandler(async (req, res, next) => {
  const schedules = await adminScopedQuery(Schedule, req, { isActive: true })
    .populate({
      path: 'classId',
      select: 'className subjectName',
      model: 'Class'
    })
    .populate({
      path: 'teacherId',
      select: 'name email',
      model: 'Teacher'
    })
    .sort({ dayOfWeek: 1, startTime: 1 });

  res.status(200).json({
    success: true,
    count: schedules.length,
    data: schedules
  });
});

// @desc    Get single schedule
// @route   GET /api/schedules/:id
// @access  Private
exports.getSchedule = asyncHandler(async (req, res, next) => {
  const schedule = await adminScopedQuery(Schedule, req, { _id: req.params.id })
    .populate({
      path: 'classId',
      select: 'className subjectName',
      model: 'Class'
    })
    .populate({
      path: 'teacherId',
      select: 'name email',
      model: 'Teacher'
    });

  if (!schedule || (Array.isArray(schedule) && schedule.length === 0)) {
    return next(new ErrorResponse(`Schedule not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: Array.isArray(schedule) ? schedule[0] : schedule
  });
});

// @desc    Create new schedule
// @route   POST /api/schedules
// @access  Private/Admin
exports.createSchedule = asyncHandler(async (req, res, next) => {
  // Check if class exists
  const classExists = await Class.findById(req.body.classId);
  if (!classExists) {
    return next(new ErrorResponse('Class not found', 404));
  }

  // Check if teacher exists
  const teacherExists = await Teacher.findById(req.body.teacherId);
  if (!teacherExists) {
    return next(new ErrorResponse('Teacher not found', 404));
  }

  // Attach adminId to the schedule data
  const scheduleData = attachAdminId(req, req.body);
  const schedule = await Schedule.create(scheduleData);
  
  // Populate the created schedule
  const populatedSchedule = await Schedule.findById(schedule._id)
    .populate({
      path: 'classId',
      select: 'className subjectName',
      model: 'Class'
    })
    .populate({
      path: 'teacherId',
      select: 'name email',
      model: 'Teacher'
    });

  res.status(201).json({
    success: true,
    data: populatedSchedule
  });
});

// @desc    Update schedule
// @route   PUT /api/schedules/:id
// @access  Private/Admin
exports.updateSchedule = asyncHandler(async (req, res, next) => {
  let schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    return next(new ErrorResponse(`Schedule not found with id of ${req.params.id}`, 404));
  }

  // Update the updatedAt field
  req.body.updatedAt = Date.now();

  schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate({
    path: 'classId',
    select: 'className subjectName',
    model: 'Class'
  }).populate({
    path: 'teacherId',
    select: 'name email',
    model: 'Teacher'
  });

  res.status(200).json({
    success: true,
    data: schedule
  });
});

// @desc    Delete schedule
// @route   DELETE /api/schedules/:id
// @access  Private/Admin
exports.deleteSchedule = asyncHandler(async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    return next(new ErrorResponse(`Schedule not found with id of ${req.params.id}`, 404));
  }

  // Soft delete by setting isActive to false
  schedule.isActive = false;
  await schedule.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get schedules by class
// @route   GET /api/schedules/class/:classId
// @access  Private
exports.getSchedulesByClass = asyncHandler(async (req, res, next) => {
  const schedules = await adminScopedQuery(Schedule, req, {
    classId: req.params.classId,
    isActive: true
  })
    .populate('classId', 'className subjectName')
    .populate('teacherId', 'name')
    .sort({ dayOfWeek: 1, startTime: 1 });

  res.status(200).json({
    success: true,
    count: schedules.length,
    data: schedules
  });
});

// @desc    Get schedules by teacher
// @route   GET /api/schedules/teacher/:teacherId
// @access  Private
exports.getSchedulesByTeacher = asyncHandler(async (req, res, next) => {
  const schedules = await adminScopedQuery(Schedule, req, {
    teacherId: req.params.teacherId,
    isActive: true
  })
    .populate('classId', 'className subjectName')
    .populate('teacherId', 'name')
    .sort({ dayOfWeek: 1, startTime: 1 });

  res.status(200).json({
    success: true,
    count: schedules.length,
    data: schedules
  });
});

// @desc    Get schedules by day
// @route   GET /api/schedules/day/:day
// @access  Private
exports.getSchedulesByDay = asyncHandler(async (req, res, next) => {
  const schedules = await adminScopedQuery(Schedule, req, {
    dayOfWeek: req.params.day,
    isActive: true
  })
    .populate('classId', 'className subjectName')
    .populate('teacherId', 'name')
    .sort({ startTime: 1 });

  res.status(200).json({
    success: true,
    count: schedules.length,
    data: schedules
  });
});

// @desc    Check for schedule conflicts
// @route   POST /api/schedules/check-conflicts
// @access  Private/Admin
exports.checkConflicts = asyncHandler(async (req, res, next) => {
  const { teacherId, dayOfWeek, startTime, endTime, room, scheduleId } = req.body;

  const query = {
    dayOfWeek,
    isActive: true,
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  };

  if (scheduleId) {
    query._id = { $ne: scheduleId };
  }

  // Check teacher conflicts
  const teacherConflicts = await Schedule.find({
    ...query,
    teacherId
  }).populate('classId', 'className subjectName');

  // Check room conflicts
  const roomConflicts = await Schedule.find({
    ...query,
    room
  }).populate('classId', 'className subjectName');

  res.status(200).json({
    success: true,
    data: {
      teacherConflicts,
      roomConflicts
    }
  });
}); 
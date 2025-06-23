const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');
const { adminScopedQuery, attachAdminId } = require('../utils/adminQueryHelper');
const { isSunday, isHoliday } = require('../utils/holidayUtils');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Mark attendance for a class
// @route   POST /api/attendance/mark
// @access  Private (Teacher, Admin)
exports.markAttendance = asyncHandler(async (req, res, next) => {
  console.log('DEBUG markAttendance: req.user =', req.user);
  console.log('DEBUG markAttendance: req.user.adminId =', req.user.adminId);
  console.log('DEBUG markAttendance: req.body =', req.body);
  const { classId, date, attendanceList } = req.body;
  const { _id: markedBy } = req.user;

  if (isSunday(date) || await isHoliday(date)) {
    return next(new ErrorResponse('Cannot mark attendance on a holiday.', 400));
  }

  // Verify class belongs to the admin's organization
  const classToUpdate = await adminScopedQuery(Class, req).findOne({ _id: classId });
  if (!classToUpdate) {
    return next(new ErrorResponse(`Class with id ${classId} not found in your organization.`, 404));
  }

  const records = await Promise.all(attendanceList.map(async (item, idx) => {
    // Verify student belongs to the admin's organization
    const student = await adminScopedQuery(Student, req).findOne({ _id: item.studentId });
    if (!student) {
      throw new ErrorResponse(`Student with id ${item.studentId} not found in your organization.`, 404);
    }

    const attendanceData = attachAdminId(req, {
      student: item.studentId,
      class: classId,
      date,
      status: item.status,
      markedBy,
      time: item.time,
      remarks: item.remarks,
    });
    if (idx === 0) console.log('DEBUG markAttendance: attendanceData for first student =', attendanceData);

    return Attendance.findOneAndUpdate(
      { student: item.studentId, class: classId, date },
      attendanceData,
      { upsert: true, new: true, runValidators: true }
    );
  }));

  res.status(200).json({ success: true, data: records });
});

// @desc    Get attendance for a class by date
// @route   GET /api/attendance/class/:classId
// @access  Private (Teacher, Admin)
exports.getClassAttendance = asyncHandler(async (req, res, next) => {
  const { classId } = req.params;
  const { date } = req.query;

  if (!date) {
      return next(new ErrorResponse('Please provide a date.', 400));
  }

  // Verify class belongs to the admin's organization
  const classToView = await adminScopedQuery(Class, req).findOne({ _id: classId });
  if (!classToView) {
    return next(new ErrorResponse(`Class with id ${classId} not found in your organization.`, 404));
  }

  const records = await adminScopedQuery(Attendance, req)
    .find({ class: classId, date: new Date(date) })
    .populate('student', 'name');

  res.status(200).json({ success: true, count: records.length, data: records });
});

// @desc    Get all attendance for a single student
// @route   GET /api/attendance/student/:studentId
// @access  Private (Student, Teacher, Admin)
exports.getStudentAttendance = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  const { role, roleId } = req.user;

  // Students can only see their own attendance
  if (role === 'student' && roleId.toString() !== studentId) {
      return next(new ErrorResponse('You are not authorized to view this attendance.', 403));
  }
  
  // Verify student exists in the organization
  const student = await adminScopedQuery(Student, req).findOne({ _id: studentId });
  if (!student) {
      return next(new ErrorResponse(`Student not found in your organization.`, 404));
  }

  const records = await adminScopedQuery(Attendance, req)
    .find({ student: studentId })
    .populate('class', 'className subjectName');

  res.status(200).json({ success: true, count: records.length, data: records });
});

// @desc    Update a single attendance record
// @route   PUT /api/attendance/:id
// @access  Private (Teacher, Admin)
exports.updateAttendance = asyncHandler(async (req, res, next) => {
    const record = await adminScopedQuery(Attendance, req).findOne({ _id: req.params.id });
    
    if (!record) {
        return next(new ErrorResponse(`Attendance record not found with id ${req.params.id}`, 404));
    }

    // Ensure adminId is not changed
    const adminIdFromToken = req.user.role === 'admin' ? req.user.roleId.toString() : req.user.adminId.toString();
    if (req.body.adminId && req.body.adminId !== adminIdFromToken) {
        return next(new ErrorResponse('Not authorized to change ownership of the record.', 401));
    }

    const updatedRecord = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: updatedRecord });
}); 
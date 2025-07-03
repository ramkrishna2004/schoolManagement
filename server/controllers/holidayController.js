const Holiday = require('../models/Holiday');
const { adminScopedQuery, attachAdminId } = require('../utils/adminQueryHelper');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a holiday
// @route   POST /api/holidays
// @access  Private/Admin
exports.createHoliday = asyncHandler(async (req, res, next) => {
  const holidayData = attachAdminId(req, req.body);
  const holiday = await Holiday.create(holidayData);
  res.status(201).json({
    success: true,
    data: holiday
  });
});

// @desc    Get all holidays for the organization
// @route   GET /api/holidays
// @access  Private
exports.getHolidays = asyncHandler(async (req, res, next) => {
  // Pagination
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;
  let skip = (page - 1) * limit;

  const baseQuery = adminScopedQuery(Holiday, req);
  const total = await baseQuery.clone().countDocuments();
  const holidays = await baseQuery.sort({ date: 1 }).skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    count: holidays.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: holidays
  });
});

// @desc    Get a single holiday
// @route   GET /api/holidays/:id
// @access  Private
exports.getHoliday = asyncHandler(async (req, res, next) => {
  const holiday = await adminScopedQuery(Holiday, req).findOne({ _id: req.params.id });

  if (!holiday) {
    return next(new ErrorResponse(`Holiday not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: holiday
  });
});

// @desc    Update a holiday
// @route   PUT /api/holidays/:id
// @access  Private/Admin
exports.updateHoliday = asyncHandler(async (req, res, next) => {
  let holiday = await adminScopedQuery(Holiday, req).and([{ _id: req.params.id }]);

  if (!holiday || holiday.length === 0) {
    return next(new ErrorResponse(`Holiday not found with id of ${req.params.id}`, 404));
  }

  // Ensure adminId is not changed
  const adminIdFromToken = req.user.role === 'admin' ? req.user.roleId.toString() : req.user.adminId.toString();
  if (req.body.adminId && req.body.adminId !== adminIdFromToken) {
      return next(new ErrorResponse('Not authorized to change ownership of the holiday.', 401));
  }

  holiday = await Holiday.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: holiday
  });
});

// @desc    Delete a holiday
// @route   DELETE /api/holidays/:id
// @access  Private/Admin
exports.deleteHoliday = asyncHandler(async (req, res, next) => {
  const holiday = await adminScopedQuery(Holiday, req).and([{ _id: req.params.id }]);

  if (!holiday || holiday.length === 0) {
    return next(new ErrorResponse(`Holiday not found with id of ${req.params.id}`, 404));
  }

  await Holiday.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
}); 
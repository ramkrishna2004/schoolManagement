const express = require('express');
const router = express.Router();
const {
  createHoliday,
  getHolidays,
  getHoliday,
  updateHoliday,
  deleteHoliday
} = require('../controllers/holidayController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router
  .route('/')
  .post(authorize('admin'), createHoliday)
  .get(getHolidays);

router
  .route('/:id')
  .get(getHoliday)
  .put(authorize('admin'), updateHoliday)
  .delete(authorize('admin'), deleteHoliday);

module.exports = router; 
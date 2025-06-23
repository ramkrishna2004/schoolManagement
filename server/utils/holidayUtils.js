const Holiday = require('../models/Holiday');

function isSunday(dateStr) {
  const date = new Date(dateStr);
  return date.getDay() === 0;
}

async function isHoliday(dateStr) {
  const date = new Date(dateStr);
  const holiday = await Holiday.findOne({ date });
  return !!holiday;
}

module.exports = { isSunday, isHoliday }; 
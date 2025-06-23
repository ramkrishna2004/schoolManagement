const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const adminRoutes = require('./admins');
const teacherRoutes = require('./teachers');
const studentRoutes = require('./students');
const classRoutes = require('./classes');
const testRoutes = require('./tests');
const scoreRoutes = require('./scores');
const announcementRoutes = require('./announcementRoutes');
const diaryRoutes = require('./diaryRoutes');

// Use route modules
router.use('/auth', authRoutes);
router.use('/admins', adminRoutes);
router.use('/teachers', teacherRoutes);
router.use('/students', studentRoutes);
router.use('/classes', classRoutes);
router.use('/tests', testRoutes);
router.use('/scores', scoreRoutes);
router.use('/announcements', announcementRoutes);
router.use('/diaries', diaryRoutes);

module.exports = router; 
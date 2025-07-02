const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(express.json());

const holidayRoutes = require('./routes/holiday');
const attendanceRoutes = require('./routes/attendance');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const classRoutes = require('./routes/classRoutes');
const testRoutes = require('./routes/testRoutes');
const teacherRoutes = require('./routes/teachers');
const studentRoutes = require('./routes/students');
const scoreRoutes = require('./routes/scores');
const scheduleRoutes = require('./routes/schedules');
const materialRoutes = require('./routes/materialRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/holidays', holidayRoutes);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://192.168.166.91:3000'
  ],
  credentials: true
}));

app.listen(5000,() => console.log('Server running on port 5000')); 
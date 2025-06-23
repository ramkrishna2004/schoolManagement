const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const path = require('path');
const { startCleanupScheduler } = require('./utils/announcementCleanup');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

app.set('trust proxy', 1); // Trust first proxy

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increase for dev/prod safety)
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
  // In production, use a distributed store like Redis for rate limiting
  // store: new RedisStore({ ... })
});
app.use(limiter);

// Routes
const routes = {
  '/api/auth': require('./routes/auth'),
  '/api/superadmin': require('./routes/superAdminRoutes'),
  '/api/admins': require('./routes/adminRoutes'),
  '/api/teachers': require('./routes/teacherRoutes'),
  '/api/students': require('./routes/studentRoutes'),
  '/api/classes': require('./routes/classRoutes'),
  '/api/tests': require('./routes/testRoutes'),
  '/api/scores': require('./routes/scoreRoutes'),
  '/api/schedules': require('./routes/schedules'),
  '/api/materials': require('./routes/materialRoutes'),
  '/api/announcements': require('./routes/announcementRoutes'),
  '/api/diaries': require('./routes/diaryRoutes'),
  '/api/holidays': require('./routes/holiday'),
  '/api/attendance': require('./routes/attendance'),
  '/api/analytics': require('./routes/analytics'),
  '/api/offline-tests': require('./routes/offlineTests'),
};

// Mount all routes dynamically
for (const [path, route] of Object.entries(routes)) {
  app.use(path, route);
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start announcement cleanup scheduler
  startCleanupScheduler();
}); 
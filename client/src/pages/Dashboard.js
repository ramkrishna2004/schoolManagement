import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardActions, Button, Tooltip, Typography, Grid, Box, Avatar, Divider, useMediaQuery } from '@mui/material';
import { People, School, Assessment, Add, Class as ClassIcon, MenuBook, Assignment, Notifications, Info, Dashboard as DashboardIcon, Announcement as AnnouncementIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import AnnouncementList from '../components/AnnouncementList';
import { announcementService } from '../services/announcementService';
import { motion } from 'framer-motion';
import axios from 'axios';


function GraphicalWorldLanding() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-blue-200 to-white overflow-hidden px-4">
      {/* Animated SVG Background */}
      <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1440 900" fill="none">
        <ellipse cx="400" cy="200" rx="320" ry="80" fill="#bae6fd" opacity="0.25" />
        <ellipse cx="1200" cy="700" rx="260" ry="60" fill="#7dd3fc" opacity="0.18" />
        <ellipse cx="900" cy="300" rx="180" ry="40" fill="#38bdf8" opacity="0.12" />
      </svg>
      {/* Parallax Floating Shapes */}
      <motion.div
        className="absolute left-1/4 top-24 z-0"
        animate={{ y: [0, 30, 0], rotate: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="36" fill="#7dd3fc" opacity="0.18" /></svg>
      </motion.div>
      <motion.div
        className="absolute right-1/4 top-40 z-0"
        animate={{ y: [0, -24, 0], rotate: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none"><rect x="10" y="10" width="40" height="40" rx="12" fill="#bae6fd" opacity="0.16" /></svg>
      </motion.div>
      <motion.div
        className="absolute left-16 bottom-24 z-0"
        animate={{ y: [0, 18, 0], rotate: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><polygon points="24,4 44,44 4,44" fill="#38bdf8" opacity="0.13" /></svg>
      </motion.div>
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="z-10 bg-white/90 rounded-3xl shadow-2xl border-2 border-sky-200 max-w-xl w-full flex flex-col items-center py-12 px-8 mb-10 backdrop-blur-md"
      >
        <div className="flex flex-col items-center mb-6">
          <span className="inline-block bg-sky-400 rounded-full p-3 shadow-lg mb-2">
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#38bdf8"/><text x="24" y="32" textAnchor="middle" fontSize="22" fill="white" fontWeight="bold">SMS</text></svg>
          </span>
          <h1 className="text-3xl font-extrabold text-sky-700 mb-1 tracking-tight">Welcome to StudentMS</h1>
          <p className="text-lg text-blue-900 font-medium text-center">Empowering Schools, Teachers & Students</p>
        </div>
        <div className="w-full flex flex-col gap-4 mt-4">
          <motion.div
            whileHover={{ scale: 1.04, boxShadow: '0 4px 24px #bae6fd' }}
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all cursor-pointer bg-sky-50/60 hover:bg-sky-100"
          >
            <School className="text-sky-400" />
            <span className="text-blue-800 font-semibold">Student Management</span>
            <span className="text-blue-500 text-sm">Enroll, track, and manage students with ease.</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.04, boxShadow: '0 4px 24px #7dd3fc' }}
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all cursor-pointer bg-blue-50/60 hover:bg-blue-100"
          >
            <People className="text-blue-400" />
            <span className="text-blue-800 font-semibold">Teacher Management</span>
            <span className="text-blue-500 text-sm">Manage teacher profiles, assignments, and schedules.</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.04, boxShadow: '0 4px 24px #67e8f9' }}
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all cursor-pointer bg-cyan-50/60 hover:bg-cyan-100"
          >
            <ClassIcon className="text-cyan-400" />
            <span className="text-blue-800 font-semibold">Class Scheduling</span>
            <span className="text-blue-500 text-sm">Organize classes, timetables, and attendance.</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.04, boxShadow: '0 4px 24px #38bdf8' }}
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all cursor-pointer bg-sky-50/60 hover:bg-sky-100"
          >
            <Assessment className="text-sky-500" />
            <span className="text-blue-800 font-semibold">Test Management</span>
            <span className="text-blue-500 text-sm">Create, assign, and analyze tests and results.</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.04, boxShadow: '0 4px 24px #60a5fa' }}
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all cursor-pointer bg-blue-50/60 hover:bg-blue-100"
          >
            <MenuBook className="text-blue-300" />
            <span className="text-blue-800 font-semibold">Materials</span>
            <span className="text-blue-500 text-sm">Upload and share learning materials and resources.</span>
          </motion.div>
        </div>
        <div className="flex gap-6 mt-10">
          <Link to="/login">
            <motion.button
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
            >
              Login
            </motion.button>
          </Link>
        </div>
      </motion.div>
      {/* Subtle floating icons */}
      <motion.div
        className="absolute left-10 bottom-10 z-0"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
      >
        <School className="text-sky-200" style={{ fontSize: 48 }} />
      </motion.div>
      <motion.div
        className="absolute right-10 top-20 z-0"
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
      >
        <Assessment className="text-blue-200" style={{ fontSize: 44 }} />
      </motion.div>
      <motion.div
        className="absolute right-32 bottom-24 z-0"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
      >
        <MenuBook className="text-blue-100" style={{ fontSize: 40 }} />
      </motion.div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [announcements, setAnnouncements] = useState([]);
  const [teacherClasses, setTeacherClasses] = useState([]);

  // Redirect superadmin to their dashboard
  useEffect(() => {
    if (user && user.role === 'superadmin') {
      navigate('/superadmin/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementService.getAnnouncements();
        setAnnouncements(data);
      } catch (e) {
        // Optionally log error or ignore
      }
    };
    fetchAnnouncements();

    if (user?.role === 'teacher') {
      const fetchClasses = async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const res = await axios.get('/api/classes', {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
              setTeacherClasses(res.data.data);
            }
          }
        } catch (error) {
          console.error('Failed to fetch teacher classes:', error);
        }
      };
      fetchClasses();
    }
  }, [user]);

  if (!user) {
    return <GraphicalWorldLanding />;
  }

  // Quick actions for each role
  const quickActions = {
    admin: [
      { label: 'Register User', icon: <Add />, color: 'primary', to: '/register' },
      { label: 'Create Class', icon: <ClassIcon />, color: 'secondary', to: '/classes/new' },
      { label: 'Create Announcement', icon: <AnnouncementIcon />, color: 'info', to: '/admin/announcements', state: { openForm: true } },
      { label: 'Manage Class Diaries', icon: <MenuBook />, color: 'info', to: '/admin/diary' },
      { label: 'Manage Holidays', icon: <Assignment />, color: 'success', to: '/admin/holidays' },
    ],
    teacher: [
      { label: 'Create Test', icon: <Add />, color: 'primary', to: '/teacher/tests' },
      { label: 'Upload Material', icon: <MenuBook />, color: 'secondary', to: '/materials' },
      { label: 'Take Attendance', icon: <Assignment />, color: 'success', to: '/teacher/attendance' },
      { label: 'Manage Diary', icon: <MenuBook />, color: 'info', to: '/teacher/diary' },
    ],
    student: [
      { label: 'Join Class', icon: <ClassIcon />, color: 'primary', to: '/student/classes' },
      { label: 'View Assignments', icon: <Assignment />, color: 'secondary', to: '/materials' },
      { label: 'Contact Teacher', icon: <People />, color: 'success', to: '/teachers' },
      { label: 'View Diary', icon: <MenuBook />, color: 'info', to: '/student/diary' },
      { label: 'My Attendance', icon: <Assignment />, color: 'success', to: '/student/attendance' },
    ],
  };

  // Cards for each role
  const roleCards = {
    admin: [
      {
        title: 'Teachers',
        desc: 'Manage all teachers and their accounts.',
        icon: <People fontSize="large" color="primary" />, href: '/teachers',
        color: 'primary',
      },
      {
        title: 'Students',
        desc: 'Manage all students and their accounts.',
        icon: <School fontSize="large" color="success" />, href: '/students',
        color: 'success',
      },
      {
        title: 'Classes',
        desc: 'Create, edit, and assign classes.',
        icon: <ClassIcon fontSize="large" color="secondary" />, href: '/classes',
        color: 'secondary',
      },
      {
        title: 'Test Analytics',
        desc: 'View overall test performance and analytics.',
        icon: <Assessment fontSize="large" color="info" />, href: '/admin/analytics',
        color: 'info',
      },
      {
        title: 'Manage Holidays',
        desc: 'Add or view school holidays.',
        icon: <Assignment fontSize="large" color="success" />, href: '/admin/holidays',
        color: 'success',
      },
    ],
    teacher: [
      {
        title: 'Test Management',
        desc: 'Create and manage tests, view scores, and track student progress.',
        icon: <Assessment fontSize="large" color="primary" />, href: '/teacher/tests',
        color: 'primary',
      },
      {
        title: 'Test Analytics',
        desc: 'View performance analytics for your classes.',
        icon: <Assessment fontSize="large" color="info" />,
        href: teacherClasses.length > 0 ? `/teacher/analytics/${teacherClasses[0]?._id}` : '/classes',
        color: 'info',
      },
      {
        title: 'Class Management',
        desc: 'Manage classes, view rosters, and track attendance.',
        icon: <ClassIcon fontSize="large" color="secondary" />, href: '/classes',
        color: 'secondary',
      },
      {
        title: 'Material Management',
        desc: 'Upload and manage learning materials.',
        icon: <MenuBook fontSize="large" color="success" />, href: '/materials',
        color: 'success',
      },
      {
        title: 'Take Attendance',
        desc: 'Mark attendance for your classes.',
        icon: <Assignment fontSize="large" color="success" />, href: '/teacher/attendance',
        color: 'success',
      },
    ],
    student: [
      {
        title: 'My Tests',
        desc: 'View available tests and track your progress.',
        icon: <Assessment fontSize="large" color="primary" />, href: '/student/tests',
        color: 'primary',
      },
      {
        title: 'My Scores',
        desc: 'View your test scores and analytics.',
        icon: <Info fontSize="large" color="success" />, href: '/scores',
        color: 'success',
      },
      {
        title: 'Test Analytics',
        desc: 'Visualize your test performance and score trends.',
        icon: <Assessment fontSize="large" color="info" />, href: '/student/analytics',
        color: 'info',
      },
      {
        title: 'My Classes',
        desc: 'View your enrolled classes and assignments.',
        icon: <ClassIcon fontSize="large" color="secondary" />, href: '/student/classes',
        color: 'secondary',
      },
      {
        title: 'Learning Materials',
        desc: 'Access study materials and resources.',
        icon: <MenuBook fontSize="large" color="info" />, href: '/materials',
        color: 'info',
      },
      {
        title: 'My Attendance',
        desc: 'View your attendance records.',
        icon: <Assignment fontSize="large" color="success" />, href: '/student/attendance',
        color: 'success',
      },
    ],
  };

  // User info card
  const userInfo = (
    <Card className="mb-6" sx={{ mb: 4, background: 'linear-gradient(90deg, #bae6fd 0%, #7dd3fc 100%)', border: 0 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, boxShadow: 3 }}>
            <DashboardIcon />
          </Avatar>
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: 'spring' }}
            >
              <span className="inline-block mr-2 animate-wave text-2xl">👋</span>
              <span
                className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-blue-500 text-2xl sm:text-3xl md:text-4xl drop-shadow"
                style={{ fontFamily: 'inherit', letterSpacing: '0.01em' }}
              >
                Welcome, {user?.name}
              </span>
            </motion.div>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Notification/alert area (replaces placeholder)
  const notifications = (
    <Card className="mb-6" sx={{ mb: 4 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Notifications color="warning" />
          <Box flex={1}>
            <AnnouncementList announcements={announcements} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Redesigned Quick Actions block
  const quickActionButtons = (
    <Box
      sx={{
        mb: 4,
        p: { xs: 1.5, sm: 3 },
        background: 'linear-gradient(90deg, #f0f9ff 0%, #e0e7ff 100%)',
        borderRadius: 4,
        boxShadow: 2,
        border: '1px solid #e0e7ef',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={2} color="primary.main" sx={{ letterSpacing: 0.5 }}>
        Quick Actions
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: isMobile ? 'center' : 'flex-start',
          alignItems: isMobile ? 'stretch' : 'center',
        }}
      >
        {quickActions[user?.role]?.map((action, idx) => (
          <Tooltip title={action.label} arrow key={idx}>
            <Button
              component={Link}
              to={action.to}
              state={action.state}
              variant="contained"
              color={action.color}
              startIcon={action.icon}
              size={isMobile ? 'medium' : 'large'}
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                px: isMobile ? 2 : 3,
                py: isMobile ? 1 : 1.5,
                boxShadow: 1,
                textTransform: 'none',
                fontSize: isMobile ? '0.95rem' : '1rem',
                minWidth: isMobile ? 120 : 170,
                transition: 'all 0.18s',
                width: isMobile ? '100%' : 'auto',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px) scale(1.04)',
                },
              }}
              aria-label={action.label}
              fullWidth={isMobile}
            >
              {action.label}
            </Button>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );

  // Redesigned Management Access Cards block
  const managementCards = (
    <Box
      sx={{
        mt: 0,
        mb: 4,
        p: { xs: 1.5, sm: 3 },
        background: 'linear-gradient(90deg, #f8fafc 0%, #e0e7ef 100%)',
        borderRadius: 4,
        boxShadow: 1,
        border: '1px solid #e0e7ef',
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={2} color="secondary.main" sx={{ letterSpacing: 0.5 }}>
        Management Access
      </Typography>
      <Grid container spacing={3}>
        {roleCards[user?.role]?.map((card, idx) => (
          <Grid item xs={12} sm={isMobile ? 12 : 6} md={4} key={idx}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                boxShadow: 2,
                border: '1px solid #e0e7ef',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px) scale(1.03)',
                },
              }}
              tabIndex={0}
              aria-label={card.title}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  {card.icon}
                  <Typography variant="h6" fontWeight={700} color={`${card.color}.main`}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {card.desc}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  color={card.color}
                  href={card.href}
                  fullWidth
                  sx={{
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                    transition: 'all 0.2s',
                    fontSize: isMobile ? '0.95rem' : '1rem',
                    '&:hover': {
                      boxShadow: 2,
                      backgroundColor: `${card.color}.light`,
                    },
                  }}
                  aria-label={`Go to ${card.title}`}
                >
                  Go to {card.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Add keyframes for waving hand animation
  const style = document.createElement('style');
  style.innerHTML = `
  @keyframes wave {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(14deg); }
    20% { transform: rotate(-8deg); }
    30% { transform: rotate(14deg); }
    40% { transform: rotate(-4deg); }
    50% { transform: rotate(10deg); }
    60% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
  }
  .animate-wave { display: inline-block; animation: wave 1.6s infinite; transform-origin: 70% 70%; }
  `;
  if (!document.head.querySelector('style[data-dashboard-wave]')) {
    style.setAttribute('data-dashboard-wave', '');
    document.head.appendChild(style);
  }

  return (
    <Box
      className="mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-20"
      sx={{
        minHeight: '100vh',
        maxWidth: { xs: '100%', sm: '100%', md: '1200px', lg: '1400px', xl: '1800px', '2xl': '2000px' },
      }}
    >
      {userInfo}
      {notifications}
      {quickActionButtons}
      {managementCards}
      <Divider sx={{ my: 4 }} />
    </Box>
  );
}

export default Dashboard; 
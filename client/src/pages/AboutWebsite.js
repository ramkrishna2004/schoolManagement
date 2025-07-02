import React from 'react';
import { Box, Typography, Chip, Divider, Button, Avatar } from '@mui/material';
import { School, MenuBook, Assignment, Announcement, People, Class as ClassIcon, MonetizationOn, Hotel, Assessment, MoreHoriz, Update, Analytics, MobileFriendly, NotificationsActive, Palette, AdminPanelSettings } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';

const currentServices = [
  { icon: <School sx={{ color: '#0284c7' }} />, title: 'Student Management', desc: 'Enroll, track, and manage students with ease.' },
  { icon: <People sx={{ color: '#0284c7' }} />, title: 'Teacher Management', desc: 'Manage teacher profiles, assignments, and schedules.' },
  { icon: <ClassIcon sx={{ color: '#0284c7' }} />, title: 'Class Scheduling', desc: 'Organize classes, timetables, and attendance.' },
  { icon: <Assignment sx={{ color: '#0284c7' }} />, title: 'Test Management', desc: 'Create, assign, and analyze tests and results.' },
  { icon: <MenuBook sx={{ color: '#0284c7' }} />, title: 'Materials', desc: 'Upload and share learning materials and resources.' },
  { icon: <Announcement sx={{ color: '#0284c7' }} />, title: 'Announcements', desc: 'Create and manage school-wide announcements.' },
];

const whatsNew = [
  { icon: <Analytics sx={{ color: '#0284c7' }} />, title: 'Advanced Analytics Dashboard', desc: 'Modern, interactive analytics for admins and teachers, including class and student trends.' },
  { icon: <MobileFriendly sx={{ color: '#0284c7' }} />, title: 'Mobile-First UI', desc: 'Fully responsive, professional design for all devices.' },
  { icon: <Palette sx={{ color: '#0284c7' }} />, title: 'Glassmorphism & Gradients', desc: 'Beautiful, modern look with glassy cards and animated gradients.' },
  { icon: <NotificationsActive sx={{ color: '#0284c7' }} />, title: 'Improved Notifications', desc: 'Elegant, animated notifications and announcement cards.' },
  { icon: <Assignment sx={{ color: '#0284c7' }} />, title: 'Animated Inputs', desc: 'All forms use animated, interactive input fields for a consistent experience.' },
  { icon: <AdminPanelSettings sx={{ color: '#0284c7' }} />, title: 'Role-Based Dashboards', desc: 'Distinct, modern dashboards for Admin, Teacher, and Student roles.' },
];

const futureServices = [
  { icon: <MonetizationOn sx={{ color: '#0284c7' }} />, title: 'Fee Management', desc: 'Automate and track student fee payments and dues.' },
  { icon: <Hotel sx={{ color: '#0284c7' }} />, title: 'Hostel Management', desc: 'Manage hostel rooms, allocations, and student stays.' },
  { icon: <Assessment sx={{ color: '#0284c7' }} />, title: 'Result Management', desc: 'Publish and analyze student results and report cards.' },
  { icon: <MoreHoriz sx={{ color: '#0284c7' }} />, title: 'More Modules', desc: 'Additional features for holistic school management.' },
];

function TimelineStep({ icon, title, desc, idx }) {
  return (
    <TimelineItem>
      <TimelineSeparator>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: idx * 0.15 }}
        >
          <TimelineDot
            sx={{
              background: '#0284c7',
              boxShadow: '0 0 0 6px #e0f2fe',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            <motion.div
              whileHover={{ scale: 1.15, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {icon}
            </motion.div>
          </TimelineDot>
        </motion.div>
        <TimelineConnector sx={{ background: '#7dd3fc', minHeight: 40 }} />
      </TimelineSeparator>
      <TimelineContent sx={{ py: 2, px: 1 }}>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: idx * 0.15 + 0.1 }}
        >
          <Box
            sx={{
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 4,
              boxShadow: '0 4px 24px 0 #7dd3fc33',
              border: '1.5px solid #bae6fd',
              px: { xs: 2, md: 4 },
              py: { xs: 2, md: 3 },
              mb: 2,
              maxWidth: 420,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px 0 #7dd3fc66',
              },
            }}
          >
            <Typography variant="h6" fontWeight={700} color="#0284c7" mb={0.5}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {desc}
            </Typography>
          </Box>
        </motion.div>
      </TimelineContent>
    </TimelineItem>
  );
}

function MissionBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Box
        sx={{
          background: 'linear-gradient(120deg, #e0f2fe 0%, #bae6fd 100%)',
          borderRadius: 6,
          boxShadow: '0 4px 32px 0 #7dd3fc33',
          px: { xs: 2, md: 8 },
          py: { xs: 5, md: 7 },
          my: { xs: 6, md: 10 },
          mx: 'auto',
          maxWidth: 800,
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.02)' },
        }}
      >
        <Avatar
          src="https://cdn.pixabay.com/photo/2017/01/31/13/14/avatar-2026510_1280.png"
          alt="Founder"
          sx={{ width: 80, height: 80, mx: 'auto', mb: 2, boxShadow: 3, border: '3px solid #bae6fd' }}
        />
        <Typography variant="h5" fontWeight={700} color="#0284c7" mb={2}>
          Our Mission
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={2}>
          &quot;To empower every school with seamless, modern, and joyful management tools—so educators can focus on what matters most: inspiring the next generation.&quot;
        </Typography>
        <Typography variant="subtitle2" color="#0ea5e9" fontWeight={600}>
          — The SkyNext Team
        </Typography>
      </Box>
    </motion.div>
  );
}

function FloatingIcons() {
  return (
    <>
      <motion.div
        style={{ position: 'fixed', left: 20, top: 150, zIndex: 0 }}
        animate={{ y: [0, 40, 0], scale: [1, 1.12, 1] }}
        transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
      >
        <School sx={{ fontSize: 50, color: '#7dd3fc', opacity: 0.2 }} />
      </motion.div>
      <motion.div
        style={{ position: 'fixed', right: 30, top: 300, zIndex: 0 }}
        animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 17, ease: 'easeInOut' }}
      >
        <Assessment sx={{ fontSize: 46, color: '#bae6fd', opacity: 0.18 }} />
      </motion.div>
      <motion.div
        style={{ position: 'fixed', left: 50, bottom: 100, zIndex: 0 }}
        animate={{ y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 13, ease: 'easeInOut' }}
      >
        <MenuBook sx={{ fontSize: 42, color: '#0ea5e9', opacity: 0.15 }} />
      </motion.div>
    </>
  );
}

export default function AboutWebsite() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        p: 0,
        m: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(120deg, #e0f2fe 0%, #bae6fd 100%)',
      }}
    >
      <FloatingIcons />
      {/* Hero Section */}
      <Box
        sx={{
          width: '100vw',
          minHeight: { xs: '80vh', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ backgroundPosition: '0% 50%' }}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100%',
            zIndex: 0,
            background: 'linear-gradient(120deg, #0284c7 0%, #0ea5e9 50%, #7dd3fc 100%)',
            backgroundSize: '200% 200%',
            opacity: 0.9,
          }}
        />
        <motion.svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          fill="none"
          style={{ position: 'absolute', top: 50, left: 50, zIndex: 1 }}
          animate={{ y: [0, 25, 0], rotate: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
      >
          <ellipse cx="150" cy="150" rx="100" ry="70" fill="#fff" opacity="0.1" />
        </motion.svg>
        <motion.svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          style={{ position: 'absolute', bottom: 50, right: 70, zIndex: 1 }}
          animate={{ y: [0, -25, 0], rotate: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
        >
          <ellipse cx="100" cy="100" rx="80" ry="50" fill="#fff" opacity="0.12" />
        </motion.svg>
        <Box
          sx={{
            zIndex: 2,
            px: { xs: 2, md: 8 },
            py: { xs: 6, md: 8 },
            borderRadius: 8,
            background: 'rgba(255,255,255,0.2)',
            boxShadow: '0 8px 40px 0 rgba(56,189,248,0.2)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid #bae6fd',
            textAlign: 'center',
            maxWidth: 700,
            mx: 'auto',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.02)' },
          }}
        >
              <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
              >
            <Typography
              variant="h1"
              fontWeight={900}
                  sx={{
                letterSpacing: 1,
                background: 'linear-gradient(90deg, #0284c7 0%, #7dd3fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '4.5rem' },
                mb: 2,
                lineHeight: 1.1,
              }}
            >
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                style={{ display: 'inline-block' }}
              >
                Empowering Schools
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                style={{ display: 'inline-block' }}
              >
                Elevating Education
              </motion.span>
        </Typography>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.7 }}
            >
              <Typography variant="h5" color="#22292f" mb={4} sx={{ fontWeight: 500, opacity: 0.9 }}>
                Modern, integrated management tools for the next generation of schools.
              </Typography>
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              >
              <Button
                variant="contained"
                  sx={{
                  borderRadius: 8,
                  fontWeight: 700,
                  px: 5,
                  py: 1.8,
                  fontSize: '1.2rem',
                  boxShadow: '0 4px 24px 0 #0284c755',
                  background: 'linear-gradient(90deg, #0284c7 0%, #7dd3fc 100%)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.08)',
                    boxShadow: '0 8px 32px 0 #0284c799',
                    background: 'linear-gradient(90deg, #7dd3fc 0%, #0284c7 100%)',
                  },
                  }}
                >
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        </Box>
      </Box>
      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          width: '100%',
          maxWidth: 1200,
          zIndex: 2,
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 32,
          boxShadow: '0 8px 40px 0 rgba(56,189,248,0.15)',
          backdropFilter: 'blur(20px)',
          border: '2px solid #bae6fd',
          padding: '3rem 2.5rem',
          marginTop: 0,
          marginBottom: 32,
        }}
      >
        {/* What's New Timeline Section */}
        <Box sx={{ width: '100%', position: 'relative', py: { xs: 6, md: 10 }, overflow: 'hidden' }}>
          <motion.div
            initial={{ backgroundPosition: '0% 50%' }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              background: 'linear-gradient(120deg, #e0f2fe 0%, #bae6fd 100%)',
              backgroundSize: '200% 200%',
            }}
          />
          <motion.svg
            width="400"
            height="220"
            viewBox="0 0 400 220"
            fill="none"
            style={{ position: 'absolute', top: -60, left: -80, zIndex: 0 }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
          >
            <ellipse cx="200" cy="110" rx="180" ry="80" fill="#7dd3fc" opacity="0.15" />
          </motion.svg>
          <Typography variant="overline" color="#0284c7" fontWeight={700} sx={{ letterSpacing: 2, textAlign: 'center', display: 'block', mb: 1, zIndex: 2, position: 'relative' }}>
            LATEST UPDATES
                      </Typography>
          <Typography variant="h4" fontWeight={800} color="#0284c7" mb={4} sx={{ textAlign: 'center', zIndex: 2, position: 'relative' }}>
            What&rsquo;s New
                    </Typography>
          <Timeline position="right" sx={{ mx: 'auto', maxWidth: 800, zIndex: 2, position: 'relative' }}>
            {whatsNew.map((feature, idx) => (
              <TimelineStep
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                desc={feature.desc}
                idx={idx}
              />
          ))}
          </Timeline>
        </Box>
        <Divider sx={{ my: 5, borderColor: '#7dd3fc' }}>
          <Chip icon={<Update />} label="Implemented" sx={{ fontWeight: 700, fontSize: '1rem', background: '#0284c7', color: '#fff' }} />
        </Divider>
        <MissionBlock />
        {/* Core Features Timeline Section */}
        <Box sx={{ width: '100%', position: 'relative', py: { xs: 6, md: 10 }, overflow: 'hidden' }}>
          <motion.div
            initial={{ backgroundPosition: '0% 50%' }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              background: 'linear-gradient(120deg, #e0f2fe 0%, #bae6fd 100%)',
              backgroundSize: '200% 200%',
            }}
          />
          <motion.svg
            width="400"
            height="220"
            viewBox="0 0 400 220"
            fill="none"
            style={{ position: 'absolute', bottom: -60, right: -80, zIndex: 0 }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
        >
            <ellipse cx="200" cy="110" rx="180" ry="80" fill="#0ea5e9" opacity="0.12" />
          </motion.svg>
          <Typography variant="overline" color="#0284c7" fontWeight={700} sx={{ letterSpacing: 2, textAlign: 'center', display: 'block', mb: 1, zIndex: 2, position: 'relative' }}>
            WHAT WE OFFER
          </Typography>
          <Typography variant="h4" fontWeight={800} color="#0284c7" mb={4} sx={{ textAlign: 'center', zIndex: 2, position: 'relative' }}>
            Core Features
          </Typography>
          <Timeline position="right" sx={{ mx: 'auto', maxWidth: 800, zIndex: 2, position: 'relative' }}>
            {currentServices.map((service, idx) => (
              <TimelineStep
                key={service.title}
                icon={service.icon}
                title={service.title}
                desc={service.desc}
                idx={idx}
              />
            ))}
          </Timeline>
        </Box>
        <Divider sx={{ my: 5, borderColor: '#7dd3fc' }}>
          <Chip icon={<Update />} label="Upcoming" sx={{ fontWeight: 700, fontSize: '1rem', background: '#7dd3fc', color: '#fff' }} />
        </Divider>
        {/* Animated CTA */}
        <Box sx={{ width: '100%', py: { xs: 6, md: 8 }, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
              <motion.div
            initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            transition={{ duration: 0.8 }}
              >
            <Typography variant="h4" fontWeight={800} color="#0284c7" mb={2} align="center">
              Ready to transform your school?
            </Typography>
            <Button
              variant="contained"
                  sx={{
                borderRadius: 8,
                fontWeight: 700,
                px: 5,
                py: 1.8,
                fontSize: '1.2rem',
                boxShadow: '0 4px 24px 0 #0284c755',
                background: 'linear-gradient(90deg, #0284c7 0%, #7dd3fc 100%)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.08)',
                  boxShadow: '0 8px 32px 0 #0284c799',
                  background: 'linear-gradient(90deg, #7dd3fc 0%, #0284c7 100%)',
                },
              }}
            >
              Get Started
            </Button>
          </motion.div>
        </Box>
        {/* Planned Features Timeline Section */}
        <Box sx={{ width: '100%', position: 'relative', py: { xs: 6, md: 10 }, overflow: 'hidden' }}>
          <motion.div
            initial={{ backgroundPosition: '0% 50%' }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              background: 'linear-gradient(120deg, #e0f2fe 0%, #bae6fd 100%)',
              backgroundSize: '200% 200%',
            }}
          />
          <motion.svg
            width="400"
            height="220"
            viewBox="0 0 400 220"
            fill="none"
            style={{ position: 'absolute', top: -60, right: -80, zIndex: 0 }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
          >
            <ellipse cx="200" cy="110" rx="180" ry="80" fill="#38bdf8" opacity="0.15" />
          </motion.svg>
          <Typography variant="overline" color="#0284c7" fontWeight={700} sx={{ letterSpacing: 2, textAlign: 'center', display: 'block', mb: 1, zIndex: 2, position: 'relative' }}>
            COMING SOON
                      </Typography>
          <Typography variant="h4" fontWeight={800} color="#0284c7" mb={4} sx={{ textAlign: 'center', zIndex: 2, position: 'relative' }}>
            Planned Features
                    </Typography>
          <Timeline position="right" sx={{ mx: 'auto', maxWidth: 800, zIndex: 2, position: 'relative' }}>
            {futureServices.map((service, idx) => (
              <TimelineStep
                key={service.title}
                icon={service.icon}
                title={service.title}
                desc={service.desc}
                idx={idx}
              />
          ))}
          </Timeline>
        </Box>
      </motion.div>
    </Box>
  );
} 
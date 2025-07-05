import React from 'react';
import { Box, Typography, Chip, Button, Avatar, Container, Grid, Card} from '@mui/material';
import { 
  School, MenuBook, Assignment, Announcement, People, Class as ClassIcon, 
  MonetizationOn, Hotel, Assessment,  Analytics, 
  MobileFriendly, Palette,
  TrendingUp, Security, Speed, CloudSync, Support, RocketLaunch
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const currentServices = [
  { 
    icon: <School sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Student Management', 
    desc: 'Comprehensive student enrollment, tracking, and management system with advanced analytics.' 
  },
  { 
    icon: <People sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Teacher Management', 
    desc: 'Complete teacher profile management, assignment tracking, and schedule optimization.' 
  },
  { 
    icon: <ClassIcon sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Smart Scheduling', 
    desc: 'AI-powered class scheduling with conflict resolution and optimal resource allocation.' 
  },
  { 
    icon: <Assignment sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Advanced Testing', 
    desc: 'Create, distribute, and analyze tests with real-time performance tracking.' 
  },
  { 
    icon: <MenuBook sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Digital Library', 
    desc: 'Cloud-based learning materials with version control and collaborative features.' 
  },
  { 
    icon: <Announcement sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Smart Notifications', 
    desc: 'Intelligent announcement system with targeted delivery and engagement tracking.' 
  },
];

const whatsNew = [
  { 
    icon: <Analytics sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'AI-Powered Analytics', 
    desc: 'Machine learning insights for student performance, attendance patterns, and resource optimization.' 
  },
  { 
    icon: <MobileFriendly sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Progressive Web App', 
    desc: 'Native app-like experience with offline capabilities and push notifications.' 
  },
  { 
    icon: <Palette sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Neumorphic Design', 
    desc: 'Modern soft UI with depth, shadows, and intuitive user interactions.' 
  },
  { 
    icon: <Security sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Enhanced Security', 
    desc: 'Multi-factor authentication, role-based access, and end-to-end encryption.' 
  },
  { 
    icon: <Speed sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Performance Boost', 
    desc: 'Optimized loading speeds with lazy loading and intelligent caching.' 
  },
  { 
    icon: <CloudSync sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Real-time Sync', 
    desc: 'Instant data synchronization across all devices and users.' 
  },
];

const futureServices = [
  { 
    icon: <MonetizationOn sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Financial Management', 
    desc: 'Complete fee management with payment gateways, invoicing, and financial reporting.' 
  },
  { 
    icon: <Hotel sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Campus Management', 
    desc: 'Hostel allocation, facility booking, and campus-wide resource management.' 
  },
  { 
    icon: <Assessment sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: 'Advanced Reporting', 
    desc: 'Comprehensive reporting with custom dashboards and automated insights.' 
  },
  { 
    icon: <Support sx={{ color: '#0ea5e9', fontSize: 40 }} />, 
    title: '24/7 Support', 
    desc: 'Round-the-clock technical support with live chat and video assistance.' 
  },
];

const stats = [
  { number: '500+', label: 'Schools Trust Us', icon: <School /> },
  { number: '50K+', label: 'Students Managed', icon: <People /> },
  { number: '99.9%', label: 'Uptime Guarantee', icon: <TrendingUp /> },
  { number: '24/7', label: 'Support Available', icon: <Support /> },
];

function StatCard({ stat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(14, 165, 233, 0.15)',
          border: '1px solid rgba(14, 165, 233, 0.2)',
          p: 3,
          textAlign: 'center',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 48px rgba(14, 165, 233, 0.25)',
          },
        }}
      >
        <Box sx={{ color: '#0ea5e9', mb: 2 }}>
          {stat.icon}
        </Box>
        <Typography variant="h3" fontWeight={800} color="#0ea5e9" mb={1}>
          {stat.number}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {stat.label}
        </Typography>
      </Card>
    </motion.div>
  );
}

function FeatureCard({ feature, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(14, 165, 233, 0.15)',
          border: '1px solid rgba(14, 165, 233, 0.2)',
          p: 4,
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 48px rgba(14, 165, 233, 0.25)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
              borderRadius: 3,
              p: 1.5,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {feature.icon}
          </Box>
          <Typography variant="h6" fontWeight={700} color="#0ea5e9">
            {feature.title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
          {feature.desc}
        </Typography>
      </Card>
    </motion.div>
  );
}

function FloatingElements() {
  return (
    <>
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          zIndex: 0,
        }}
        animate={{
          y: [0, -30, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(56, 189, 248, 0.1))',
            border: '2px solid rgba(14, 165, 233, 0.2)',
          }}
        />
      </motion.div>
      
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          zIndex: 0,
        }}
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(14, 165, 233, 0.1))',
            border: '2px solid rgba(56, 189, 248, 0.2)',
          }}
        />
      </motion.div>
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          zIndex: 0,
        }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(56, 189, 248, 0.1))',
            border: '2px solid rgba(14, 165, 233, 0.2)',
          }}
        />
      </motion.div>
    </>
  );
}

export default function AboutWebsite() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <FloatingElements />
      
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
        <Box
          sx={{
              textAlign: 'center',
              position: 'relative',
            zIndex: 2,
          }}
        >
              <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
              >
            <Typography
              variant="h1"
                  sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                  mb: 3,
                lineHeight: 1.1,
                  letterSpacing: '-0.02em',
              }}
            >
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                style={{ display: 'inline-block' }}
              >
                  Revolutionizing
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  style={{ display: 'inline-block' }}
                >
                  Education
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                style={{ display: 'inline-block' }}
              >
                  Management
              </motion.span>
        </Typography>
            </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: '#475569',
                  fontWeight: 400,
                  mb: 4,
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
                Experience the future of school management with our cutting-edge platform. 
                Seamlessly integrate every aspect of educational administration.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              >
              <Button
                variant="contained"
                size="large"
                startIcon={<RocketLaunch />}
                  sx={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 32px rgba(14, 165, 233, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(14, 165, 233, 0.4)',
                    background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
                  },
                  }}
                >
                Start Your Journey
              </Button>
            </motion.div>
          </Box>
        </Container>
        </Box>

      {/* Stats Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={stat.label}>
                <StatCard stat={stat} index={index} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* What's New Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 4, md: 6 } }}>
        <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Chip
                label="LATEST UPDATES"
                sx={{
                  background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#0ea5e9',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                What&apos;s New
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {whatsNew.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <FeatureCard feature={feature} index={index} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(56, 189, 248, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: 6,
                boxShadow: '0 16px 64px rgba(14, 165, 233, 0.15)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                p: { xs: 4, md: 8 },
                textAlign: 'center',
              }}
            >
              <Avatar
                src="https://cdn.pixabay.com/photo/2017/01/31/13/14/avatar-2026510_1280.png"
                alt="Founder"
                sx={{
                  width: { xs: 80, md: 120 },
                  height: { xs: 80, md: 120 },
                  mx: 'auto',
                  mb: 4,
                  boxShadow: '0 8px 32px rgba(14, 165, 233, 0.3)',
                  border: '4px solid #0ea5e9',
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#0ea5e9',
                  mb: 3,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                }}
              >
                Our Mission
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#475569',
                  mb: 3,
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                }}
              >
                &quot;To revolutionize education management through innovative technology, 
                empowering schools to focus on what truly matters: nurturing the minds 
                of tomorrow&apos;s leaders.&quot;
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#0ea5e9',
                  fontWeight: 700,
                }}
              >
                — The SkyNext Team
              </Typography>
            </Card>
          </motion.div>
        </Container>
        </Box>

      {/* Core Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Chip
                label="CORE FEATURES"
                sx={{
                  background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#0ea5e9',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                Everything You Need
          </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {currentServices.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <FeatureCard feature={feature} index={index} />
              </Grid>
            ))}
          </Grid>
        </Container>
        </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 4, md: 6 } }}>
        <Container maxWidth="lg">
              <motion.div
            initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            transition={{ duration: 0.8 }}
              >
            <Card
              sx={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                borderRadius: 6,
                boxShadow: '0 16px 64px rgba(14, 165, 233, 0.3)',
                p: { xs: 4, md: 8 },
                textAlign: 'center',
                color: 'white',
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                }}
              >
                Ready to Transform Your School?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                }}
              >
                Join thousands of schools already using our platform
            </Typography>
            <Button
              variant="contained"
                size="large"
                startIcon={<RocketLaunch />}
                  sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                fontWeight: 700,
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
                Get Started Today
            </Button>
            </Card>
          </motion.div>
        </Container>
        </Box>

      {/* Future Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Chip
                label="COMING SOON"
                sx={{
                  background: 'linear-gradient(135deg, #38bdf8, #7dd3fc)',
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#0ea5e9',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                Future Roadmap
              </Typography>
        </Box>
      </motion.div>

          <Grid container spacing={4}>
            {futureServices.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title}>
                <FeatureCard feature={feature} index={index} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
} 
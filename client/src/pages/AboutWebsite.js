import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Divider } from '@mui/material';
import { School, MenuBook, Assignment, Announcement, People, Class as ClassIcon, MonetizationOn, Hotel, Assessment, MoreHoriz, Update } from '@mui/icons-material';
import { motion } from 'framer-motion';

const currentServices = [
  { icon: <School color="primary" />, title: 'Student Management', desc: 'Enroll, track, and manage students with ease.' },
  { icon: <People color="primary" />, title: 'Teacher Management', desc: 'Manage teacher profiles, assignments, and schedules.' },
  { icon: <ClassIcon color="primary" />, title: 'Class Scheduling', desc: 'Organize classes, timetables, and attendance.' },
  { icon: <Assignment color="primary" />, title: 'Test Management', desc: 'Create, assign, and analyze tests and results.' },
  { icon: <MenuBook color="primary" />, title: 'Materials', desc: 'Upload and share learning materials and resources.' },
  { icon: <Announcement color="primary" />, title: 'Announcements', desc: 'Create and manage school-wide announcements.' },
];

const futureServices = [
  { icon: <MonetizationOn sx={{ color: '#0284c7' }} />, title: 'Fee Management', desc: 'Automate and track student fee payments and dues.' },
  { icon: <Hotel sx={{ color: '#0284c7' }} />, title: 'Hostel Management', desc: 'Manage hostel rooms, allocations, and student stays.' },
  { icon: <Assessment sx={{ color: '#0284c7' }} />, title: 'Result Management', desc: 'Publish and analyze student results and report cards.' },
  { icon: <MoreHoriz sx={{ color: '#0284c7' }} />, title: 'More Modules', desc: 'Additional features for holistic school management.' },
];

const releaseName = 'SkyNext Release';
const releaseDate = 'January';

export default function AboutWebsite() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
        py: { xs: 4, md: 8 },
        px: { xs: 2, sm: 4, md: 8 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ width: '100%', maxWidth: 900 }}
      >
        <Box
          sx={{
            background: 'linear-gradient(90deg, #7dd3fc 0%, #e0f2fe 100%)',
            borderRadius: 5,
            boxShadow: 3,
            p: { xs: 3, md: 5 },
            mb: 6,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" fontWeight={800} color="primary.main" mb={1} sx={{ letterSpacing: 1 }}>
            About This Website
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={2}>
            Empowering schools with modern, integrated management tools.
          </Typography>
          <Chip label="Current Version" color="primary" sx={{ fontWeight: 700, fontSize: '1rem', mb: 1 }} />
        </Box>

        {/* Current Services */}
        <Typography variant="h5" fontWeight={700} color="primary.main" mb={2}>
          Implemented Services
        </Typography>
        <Grid container spacing={3} mb={5}>
          {currentServices.map((service, idx) => (
            <Grid item xs={12} sm={6} md={4} key={service.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: 2,
                    background: 'linear-gradient(120deg, #e0f2fe 60%, #f0f9ff 100%)',
                    minHeight: 170,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      {service.icon}
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        {service.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {service.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 5, borderColor: '#7dd3fc' }}>
          <Chip icon={<Update />} label="Upcoming" color="info" sx={{ fontWeight: 700, fontSize: '1rem' }} />
        </Divider>

        {/* Future Release */}
        <Box
          sx={{
            background: 'linear-gradient(90deg, #bae6fd 0%, #e0f2fe 100%)',
            borderRadius: 5,
            boxShadow: 2,
            p: { xs: 3, md: 5 },
            mb: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" fontWeight={800} color="info.main" mb={1}>
            {releaseName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mb={2}>
            Major update coming in {releaseDate}!
          </Typography>
          <Chip label="Future Release" color="info" sx={{ fontWeight: 700, fontSize: '1rem', mb: 1 }} />
        </Box>
        <Typography variant="h5" fontWeight={700} color="info.main" mb={2}>
          Planned Features
        </Typography>
        <Grid container spacing={3} mb={5}>
          {futureServices.map((service, idx) => (
            <Grid item xs={12} sm={6} md={3} key={service.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: 2,
                    background: 'linear-gradient(120deg, #e0f2fe 60%, #f0f9ff 100%)',
                    minHeight: 170,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      {service.icon}
                      <Typography variant="h6" fontWeight={700} color="info.main">
                        {service.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {service.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
} 
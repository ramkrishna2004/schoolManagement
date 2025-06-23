import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const TestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`/api/tests/${id}`);
        if (response.data.success) {
          setTest(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching test details');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await axios.delete(`/api/tests/${id}`);
        navigate('/teacher/tests');
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting test');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!test) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Test not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ mt: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 4, md: 6, lg: 8, xl: 12, '2xl': 20 }, maxWidth: { xs: '100%', sm: '100%', md: '1200px', lg: '1400px', xl: '1800px', '2xl': '2000px' } }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            {test.title}
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/teacher/tests/edit/${id}`)}
              sx={{ mr: 1 }}
            >
              Edit Test
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Subject
            </Typography>
            <Typography variant="body1" gutterBottom>
              {test.subject}
            </Typography>

            <Typography variant="subtitle1" color="textSecondary">
              Class
            </Typography>
            <Typography variant="body1" gutterBottom>
              {test.classId.className}
            </Typography>

            <Typography variant="subtitle1" color="textSecondary">
              Type
            </Typography>
            <Typography variant="body1" gutterBottom>
              {test.type}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Total Marks
            </Typography>
            <Typography variant="body1" gutterBottom>
              {test.totalMarks}
            </Typography>

            <Typography variant="subtitle1" color="textSecondary">
              Duration
            </Typography>
            <Typography variant="body1" gutterBottom>
              {test.duration} minutes
            </Typography>

            <Typography variant="subtitle1" color="textSecondary">
              Scheduled Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(test.scheduledDate).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Questions
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/teacher/tests/${id}/questions`)}
            fullWidth
          >
            Manage Questions
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TestDetails; 
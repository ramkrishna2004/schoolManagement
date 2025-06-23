import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';

function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Time in seconds
  const timerRef = useRef(null); // Ref to hold the interval ID

  const fetchTestDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [testResponse, questionsResponse, attemptResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/tests/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/tests/${id}/questions`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/tests/${id}/attempts`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(err => {
          // If no attempt found, don't throw, just return null
          if (err.response && err.response.status === 404) return { data: { data: null } };
          throw err;
        })
      ]);

      setTest(testResponse.data.data);
      setQuestions(questionsResponse.data.data);
      setAttempt(attemptResponse.data.data);

      const currentAttempt = attemptResponse.data.data;
      if (currentAttempt) {
        // Initialize answers from existing attempt
        setAnswers(currentAttempt.submittedAnswers || {});

        // Calculate time left
        const durationInSeconds = testResponse.data.data.duration * 60; // duration is in minutes
        const startTime = new Date(currentAttempt.startTime).getTime();
        const now = new Date().getTime();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const remaining = durationInSeconds - elapsedSeconds;

        setTimeLeft(Math.max(0, remaining));
      } else {
        // If no active attempt, navigate back or show error
        setError('No active test attempt found. Please start the test from the list.');
        // navigate('/student/tests'); // Or handle this gracefully
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch test details or questions.');
      console.error('Error fetching test/questions/attempt:', err);
    } finally {
      setLoading(false);
    }
  }, [id, token, navigate]);

  useEffect(() => {
    fetchTestDetails();
  }, [fetchTestDetails]);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && attempt && attempt.status === 'in-progress') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handleSubmit(null, true); // Auto-submit
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && attempt?.status === 'in-progress') {
      handleSubmit(null, true); // Auto-submit immediately if time is 0 and still in-progress
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [timeLeft, attempt, test]); // Dependencies for timer

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (e, isAutoSubmit = false) => {
    if (e) e.preventDefault(); // Prevent default form submission if manually triggered

    if (!isAutoSubmit && !window.confirm('Are you sure you want to submit your answers?')) {
      return;
    }

    if (submitting) return; // Prevent multiple submissions

    setSubmitting(true);
    clearInterval(timerRef.current); // Stop the timer

    try {
      const response = await axios.put(
        `http://localhost:5000/api/tests/${id}/attempts/submit`,
        { submittedAnswers: answers },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        setAttempt(response.data.data); // Update attempt status
        alert('Test submitted successfully!');
        navigate(`/student/tests/${id}/results`); // Navigate to results page
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit test.');
      console.error('Error submitting test:', err);
      // Re-enable timer if submission failed and it was not an auto-submission? Depends on desired UX.
      // For now, let's keep it stopped to avoid confusion.
    } finally {
      setSubmitting(false);
    }
  };

  const isTestActive = attempt && attempt.status === 'in-progress' && timeLeft > 0;
  const isTestCompletedOrExpired = attempt && (attempt.status === 'completed' || attempt.status === 'expired');

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
        <Button onClick={() => navigate('/student/tests')} sx={{ mt: 2 }} variant="contained">Back to Tests</Button>
      </Container>
    );
  }

  if (!test || !questions.length) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Test data or questions not loaded. Please try again.</Alert>
        <Button onClick={() => fetchTestDetails()} sx={{ mt: 2 }} variant="contained">Retry Load</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {test.title}
        </Typography>
        {isTestActive && (
          <Paper elevation={1} sx={{ p: 1, px: 2 }}>
            <Typography variant="h6" color="primary">
              Time Left: {formatTime(timeLeft)}
            </Typography>
          </Paper>
        )}
        {isTestCompletedOrExpired && (
          <Paper elevation={1} sx={{ p: 1, px: 2 }}>
            <Typography variant="h6" color="textSecondary">
              Test Status: {attempt.status.toUpperCase()}
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Test Instructions */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Instructions
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Total Marks: {test.totalMarks} | Passing Marks: {test.passingMarks} | Duration: {test.duration} minutes
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Please answer all questions carefully. Your test will be automatically submitted when the timer runs out.
        </Typography>
        {/* Add more specific rules if needed */}
      </Paper>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          {questions.map((question, index) => (
            <Paper key={question._id} elevation={1} sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Q{index + 1}. {question.questionText} ({question.marks} marks)
              </Typography>

              {question.type === 'MCQ' && (
                <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
                  <FormLabel component="legend">Options:</FormLabel>
                  <RadioGroup
                    name={`question-${question._id}`}
                    value={answers[question._id] || ''}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  >
                    {question.options.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={option}
                        control={<Radio />}
                        label={`${String.fromCharCode(65 + idx)}. ${option}`}
                        disabled={!isTestActive} // Disable if test is not active
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}

              {question.type === 'Descriptive' && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Your Answer"
                  variant="outlined"
                  value={answers[question._id] || ''}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  sx={{ mt: 2 }}
                  disabled={!isTestActive} // Disable if test is not active
                />
              )}
            </Paper>
          ))}
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={4} mb={4}>
          <Button
            variant="outlined"
            onClick={() => navigate('/student/tests')}
            sx={{ mr: 2 }}
            disabled={submitting}
          >
            Back to Tests
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting || !isTestActive}
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default TakeTest; 
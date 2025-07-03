import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const Questions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    type: 'MCQ',
    marks: 1,
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchTestAndQuestions = async () => {
      try {
        const [testResponse, questionsResponse] = await Promise.all([
          api.get(`/api/tests/${id}`),
          api.get(`/api/tests/${id}/questions`)
        ]);

        if (testResponse.data.success) {
          setTest(testResponse.data.data);
        }
        if (questionsResponse.data.success) {
          setQuestions(questionsResponse.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchTestAndQuestions();
  }, [id]);

  const handleAddQuestion = () => {
    setCurrentQuestion({
      questionText: '',
      type: 'MCQ',
      marks: 1,
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: ''
    });
    setValidationErrors({});
    setOpenDialog(true);
  };

  const handleEditQuestion = (question) => {
    setCurrentQuestion(question);
    setValidationErrors({});
    setOpenDialog(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/api/tests/${id}/questions/${questionId}`);
        setQuestions(questions.filter(q => q._id !== questionId));
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting question');
      }
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!currentQuestion.questionText.trim()) {
      errors.questionText = 'Question text is required';
      isValid = false;
    }
    if (!currentQuestion.marks || currentQuestion.marks < 1) {
      errors.marks = 'Marks must be at least 1';
      isValid = false;
    }

    // Calculate current total marks for existing questions (excluding the one being edited)
    const existingQuestionsTotalMarks = questions.reduce((acc, q) => {
      if (currentQuestion._id && q._id === currentQuestion._id) {
        return acc; // Exclude the current question's old marks if it's being edited
      }
      return acc + q.marks;
    }, 0);

    const newTotalMarks = existingQuestionsTotalMarks + (parseInt(currentQuestion.marks) || 0);

    if (test && newTotalMarks > test.totalMarks) {
      errors.marks = `Total marks (${newTotalMarks}) exceed test's maximum marks (${test.totalMarks})`;
      isValid = false;
    }

    if (currentQuestion.type === 'MCQ') {
      const validOptions = currentQuestion.options.filter(option => option.trim() !== '');
      if (validOptions.length < 2) {
        errors.options = 'MCQ questions must have at least 2 options';
        isValid = false;
      }
      if (!currentQuestion.correctAnswer.trim() || !validOptions.includes(currentQuestion.correctAnswer)) {
        errors.correctAnswer = 'Correct answer must be selected from valid options';
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSaveQuestion = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (currentQuestion._id) {
        const response = await api.put(
          `/api/tests/${id}/questions/${currentQuestion._id}`,
          currentQuestion
        );
        if (response.data.success) {
          setQuestions(questions.map(q => 
            q._id === currentQuestion._id ? response.data.data : q
          ));
        }
      } else {
        const response = await api.post(
          `/api/tests/${id}/questions`,
          currentQuestion
        );
        if (response.data.success) {
          setQuestions([...questions, response.data.data]);
        }
      }
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving question');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ mt: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 4, md: 6, lg: 8, xl: 12, '2xl': 20 }, maxWidth: { xs: '100%', sm: '100%', md: '1200px', lg: '1400px', xl: '1800px', '2xl': '2000px' } }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(`/teacher/tests/${id}`)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {test?.title} - Questions
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Total Questions: {questions.length}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddQuestion}
          >
            Add Question
          </Button>
        </Box>

        <List>
          {questions.map((question, index) => (
            <React.Fragment key={question._id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">
                      {index + 1}. {question.questionText}
                    </Typography>
                  }
                  secondary={
                    <Box mt={1}>
                      <Typography variant="body2" color="textSecondary">
                        Type: {question.type} | Marks: {question.marks}
                      </Typography>
                      {question.type === 'MCQ' && (
                        <Box mt={1}>
                          {question.options.map((option, i) => (
                            <Typography
                              key={i}
                              variant="body2"
                              color={option === question.correctAnswer ? 'primary' : 'textSecondary'}
                            >
                              {String.fromCharCode(65 + i)}. {option}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditQuestion(question)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteQuestion(question._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < questions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 8,
            p: 2,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', pb: 1 }}>
          {currentQuestion._id ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Question Text"
                  variant="outlined"
                  InputLabelProps={{
                    sx: {
                      fontWeight: 600,
                      color: '#6366f1',
                      '&.Mui-focused': {
                        color: '#2563eb',
                        fontSize: '1rem',
                        transform: 'translate(14px, -9px) scale(0.85)',
                      },
                    },
                  }}
                  sx={{
                    mb: 2,
                    backgroundColor: '#f9fafb',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#6366f1',
                      },
                      '&:hover fieldset': {
                        borderColor: '#2563eb',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        boxShadow: '0 0 0 2px #6366f133',
                      },
                    },
                  }}
                  multiline
                  rows={3}
                  value={currentQuestion.questionText}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    questionText: e.target.value
                  })}
                  error={!!validationErrors.questionText}
                  helperText={validationErrors.questionText}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!validationErrors.type} sx={{ mb: 2 }}>
                  <InputLabel>Question Type</InputLabel>
                  <Select
                    value={currentQuestion.type}
                    label="Question Type"
                    onChange={(e) => setCurrentQuestion({
                      ...currentQuestion,
                      type: e.target.value,
                      options: ['', '', '', ''],
                      correctAnswer: ''
                    })}
                    className="skyblue-select"
                  >
                    <MenuItem value="MCQ">MCQ</MenuItem>
                    <MenuItem value="Fill in the Blank">Fill in the Blank</MenuItem>
                  </Select>
                  {validationErrors.type && <FormHelperText>{validationErrors.type}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Marks"
                  variant="outlined"
                  InputLabelProps={{
                    sx: {
                      fontWeight: 600,
                      color: '#6366f1',
                      '&.Mui-focused': {
                        color: '#2563eb',
                        fontSize: '1rem',
                        transform: 'translate(14px, -9px) scale(0.85)',
                      },
                    },
                  }}
                  sx={{
                    mb: 2,
                    backgroundColor: '#f9fafb',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#6366f1',
                      },
                      '&:hover fieldset': {
                        borderColor: '#2563eb',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        boxShadow: '0 0 0 2px #6366f133',
                      },
                    },
                  }}
                  type="number"
                  value={currentQuestion.marks}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) || 1 })}
                  inputProps={{ min: 1 }}
                  error={!!validationErrors.marks}
                  helperText={validationErrors.marks}
                />
              </Grid>
              {currentQuestion.type === 'MCQ' && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Options</Typography>
                  {currentQuestion.options.map((option, index) => (
                    <TextField
                      key={index}
                      fullWidth
                      label={`Option ${String.fromCharCode(65 + index)}`}
                      variant="outlined"
                      InputLabelProps={{
                        sx: {
                          fontWeight: 600,
                          color: '#6366f1',
                          '&.Mui-focused': {
                            color: '#2563eb',
                            fontSize: '1rem',
                            transform: 'translate(14px, -9px) scale(0.85)',
                          },
                        },
                      }}
                      sx={{
                        mb: 1,
                        backgroundColor: '#f9fafb',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#6366f1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#2563eb',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2563eb',
                            boxShadow: '0 0 0 2px #6366f133',
                          },
                        },
                      }}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      error={!!validationErrors.options}
                      helperText={validationErrors.options && `Option ${String.fromCharCode(65 + index)}: ${validationErrors.options}`}
                    />
                  ))}
                  {validationErrors.options && <Typography color="error" variant="caption">{validationErrors.options}</Typography>}
                  <FormControl fullWidth sx={{ mt: 2 }} error={!!validationErrors.correctAnswer}>
                    <InputLabel>Correct Answer</InputLabel>
                    <Select
                      value={currentQuestion.correctAnswer}
                      label="Correct Answer"
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                      className="skyblue-select"
                    >
                      {currentQuestion.options.map((option, index) => (
                        <MenuItem key={index} value={option} disabled={!option.trim()} className="skyblue-option">
                          {String.fromCharCode(65 + index)}. {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {validationErrors.correctAnswer && <FormHelperText>{validationErrors.correctAnswer}</FormHelperText>}
                  </FormControl>
                </Grid>
              )}
              {currentQuestion.type === 'Fill in the Blank' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correct Answer"
                    variant="outlined"
                    InputLabelProps={{
                      sx: {
                        fontWeight: 600,
                        color: '#6366f1',
                        '&.Mui-focused': {
                          color: '#2563eb',
                          fontSize: '1rem',
                          transform: 'translate(14px, -9px) scale(0.85)',
                        },
                      },
                    }}
                    sx={{
                      mt: 1,
                      backgroundColor: '#f9fafb',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#6366f1',
                        },
                        '&:hover fieldset': {
                          borderColor: '#2563eb',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2563eb',
                          boxShadow: '0 0 0 2px #6366f133',
                        },
                      },
                    }}
                    value={currentQuestion.correctAnswer}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                    error={!!validationErrors.correctAnswer}
                    helperText={validationErrors.correctAnswer}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#374151', fontWeight: 600, borderRadius: 2, px: 3, py: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleSaveQuestion} variant="contained" sx={{ background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)', color: '#fff', fontWeight: 700, borderRadius: 2, px: 3, py: 1, boxShadow: 2, '&:hover': { background: 'linear-gradient(90deg, #4f46e5 0%, #2563eb 100%)' } }}>
            Save Question
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Questions; 
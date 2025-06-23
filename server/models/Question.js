const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  questionText: {
    type: String,
    required: [true, 'Please add a question text'],
    trim: true
  },
  type: {
    type: String,
    enum: ['MCQ', 'Descriptive', 'Fill in the Blank'],
    required: [true, 'Please specify question type']
  },
  marks: {
    type: Number,
    required: [true, 'Please specify marks for this question'],
    min: [1, 'Marks must be at least 1']
  },
  options: {
    type: [String],
    validate: {
      validator: function(v) {
        return this.type !== 'MCQ' || (v && v.length >= 2);
      },
      message: 'MCQ questions must have at least 2 options'
    }
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: function() {
      return this.type === 'MCQ' || this.type === 'Fill in the Blank';
    },
    validate: {
      validator: function(v) {
        if (this.type === 'MCQ') {
          return typeof v === 'string' && this.options.includes(v);
        }
        if (this.type === 'Fill in the Blank') {
          return (typeof v === 'string' && v.length > 0) || 
                 (Array.isArray(v) && v.length > 0 && v.every(item => typeof item === 'string'));
        }
        return true;
      },
      message: props => {
        if (props.path === 'correctAnswer') {
          if (this.type === 'MCQ') {
            return 'Correct answer must be one of the options for MCQ questions.';
          }
          if (this.type === 'Fill in the Blank') {
            return 'Correct answer for Fill in the Blank must be a non-empty string or an array of non-empty strings.';
          }
        }
        return 'Invalid value for correct answer.';
      }
    }
  },
  explanation: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', QuestionSchema); 
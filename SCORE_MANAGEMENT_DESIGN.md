# Score Management System Design

## Overview
The Score Management System enables teachers and admins to record, update, and analyze student scores for tests. It supports manual and automatic score entry, leaderboard generation, and role-based access.

## 1. Score Management Functionalities

### For Admin:
- **Global View:** View and edit scores for all classes/tests
- **Leaderboard:** View class and school-wide leaderboards
- **Analytics:** Analyze score distributions and trends

### For Teacher:
- **Score Entry:** Enter and update scores for assigned classes/tests
- **Edit Scores:** Update scores for their students
- **Leaderboard:** View leaderboards for their classes

### For Student:
- **View Scores:** View their own scores and rankings
- **Leaderboard:** View class leaderboard

## 2. Components Structure

### Backend Components:
```
server/
├── models/
│   └── Score.js                # Score data model
├── controllers/
│   └── scoreController.js      # Score business logic
├── routes/
│   └── scoreRoutes.js          # Score API endpoints
```

### Frontend Components:
```
client/src/
├── components/
│   └── ScoreList.js            # Score listing and leaderboard
│   └── ManualScoreEntry.js     # Manual score entry form
├── pages/
│   └── ScoreList.js            # Score management page
```

## 3. Data Model

### Score Model (server/models/Score.js):
```javascript
{
  studentId: ObjectId,      // Reference to Student
  testId: ObjectId,         // Reference to Test
  classId: ObjectId,        // Reference to Class
  score: Number,            // Score value
  obtainedMarks: Number,    // Marks obtained
  totalMarks: Number,       // Total marks
  submissionDate: Date,     // Date of score entry
  isActive: Boolean,        // Active flag
  adminId: ObjectId         // Reference to Admin
}
```

## 4. Data Flow

### Score Entry Flow:
1. **Teacher/Admin** selects test and class
2. **Teacher/Admin** enters scores for students
3. **Frontend** submits score data
4. **Backend** validates permissions and class/test assignment
5. **Score** records created/updated in database
6. **Leaderboard** updated

### Permission Flow:
- **Admin:** Full access to all scores
- **Teacher:** Access to assigned classes/tests
- **Student:** Access to own scores

## 5. Page Flow

### Teacher/Admin Page Flow:
```
Dashboard → Scores → [List/Enter/Edit/Leaderboard]
├── Select Class/Test
├── Enter/Edit Scores
├── View Leaderboard
```

### Student Page Flow:
```
Dashboard → Scores → [View/Leaderboard]
├── View Own Scores
├── View Class Leaderboard
```

## 6. API Endpoints
- `GET /api/scores` - Get scores (role-based filtering)
- `POST /api/scores` - Add new score
- `PUT /api/scores/:id` - Update score
- `GET /api/scores/leaderboard` - Get leaderboard

## 7. Security & Validation
- Role-based permissions
- Input validation
- Class/test assignment checks
- Unique score per student/test

## 8. Future Enhancements
- Bulk score import/export
- Advanced analytics (charts, trends)
- Score notification system 
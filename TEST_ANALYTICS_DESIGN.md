# Test Analytics System Design

## Overview
The Test Analytics System provides insights into student performance, test participation, and trends. It tracks test attempts, scores, and generates analytics for teachers and admins.

## 1. Test Analytics Functionalities

### For Admin:
- **Global Analytics:** View analytics for all tests/classes
- **Performance Trends:** Analyze school-wide performance
- **Export Reports:** Export analytics data

### For Teacher:
- **Class Analytics:** View analytics for assigned classes/tests
- **Student Performance:** Analyze individual and class performance
- **Export Reports:** Export analytics data

### For Student:
- **Personal Analytics:** View own test performance and trends

## 2. Components Structure

### Backend Components:
```
server/
├── models/
│   └── StudentTestAttempt.js   # Test attempt data model
├── controllers/
│   └── analyticsController.js  # Analytics business logic
├── routes/
│   └── analytics.js            # Analytics API endpoints
```

### Frontend Components:
```
client/src/
├── components/
│   └── AnalyticsChart.js       # Analytics charts and graphs
├── pages/
│   └── AnalyticsPage.js        # Analytics dashboard
```

## 3. Data Model

### StudentTestAttempt Model (server/models/StudentTestAttempt.js):
```javascript
{
  studentId: ObjectId,      // Reference to User
  testId: ObjectId,         // Reference to Test
  classId: ObjectId,        // Reference to Class
  startTime: Date,          // Test start time
  endTime: Date,            // Test end time
  submittedAnswers: Map,    // QuestionId → Answer
  score: Number,            // Score obtained
  status: String,           // in-progress, completed, evaluated
  isActive: Boolean,        // Active flag
  adminId: ObjectId         // Reference to Admin
}
```

## 4. Data Flow

### Analytics Generation Flow:
1. **Student** attempts test
2. **Test attempt** recorded in StudentTestAttempt
3. **Scores** calculated and stored
4. **Analytics** generated from attempts and scores
5. **Teachers/Admins** view analytics dashboards

### Permission Flow:
- **Admin:** Full access to all analytics
- **Teacher:** Access to assigned classes/tests
- **Student:** Access to own analytics

## 5. Page Flow

### Teacher/Admin Page Flow:
```
Dashboard → Analytics → [Test/Class/Student]
├── Select Test/Class
├── View Analytics Charts
├── Export Reports
```

### Student Page Flow:
```
Dashboard → Analytics → [Personal]
├── View Own Performance
```

## 6. API Endpoints
- `GET /api/analytics` - Get analytics (role-based)
- `GET /api/analytics/test/:testId` - Get analytics for a test
- `GET /api/analytics/class/:classId` - Get analytics for a class
- `GET /api/analytics/student/:studentId` - Get analytics for a student

## 7. Security & Validation
- Role-based permissions
- Data aggregation and privacy
- Input validation

## 8. Future Enhancements
- Predictive analytics
- Comparative analytics
- Custom report builder
- Real-time analytics updates 
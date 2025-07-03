# Test Management System Design

## Overview
The Test Management System is a core module of the School Management System (SMS), enabling admins and teachers to create, schedule, and manage tests (online/offline) for classes. It supports role-based access, test lifecycle management, and integration with scores and analytics.

## 1. Test Management Functionalities

### For Admin:
- **CRUD Operations:** Create, read, update, delete any test
- **Class Assignment:** Assign tests to any class
- **Test Types:** Manage test types (Unit Test, Mid Term, Final, Quiz)
- **Global Access:** View all tests across all classes
- **Bulk Operations:** Support for bulk test creation
- **Permission Control:** Set test visibility and status

### For Teacher:
- **Restricted Creation:** Add tests only to assigned classes
- **Ownership Control:** Update/delete only tests they created
- **Class-Specific View:** View tests in their assigned classes
- **Test Scheduling:** Schedule tests with date, time, duration
- **Test Types:** Create online/offline tests

### For Student:
- **Enrolled Class Access:** View and attempt tests for enrolled classes
- **Test Attempt:** Attempt online tests within scheduled window
- **Test Details:** View test info, schedule, and results

## 2. Components Structure

### Backend Components:
```
server/
├── models/
│   └── Test.js                # Test data model
├── controllers/
│   └── testController.js      # Test business logic
├── routes/
│   └── testRoutes.js          # Test API endpoints
```

### Frontend Components:
```
client/src/
├── components/
│   └── TestManagement.js      # Test listing, creation, editing
│   └── TestForm.js            # Add/Edit test form
│   └── TestList.js            # Test list view
├── pages/
│   └── TestList.js            # Test management page
```

## 3. Data Model

### Test Model (server/models/Test.js):
```javascript
{
  title: String,           // Test title
  type: String,            // Unit Test, Mid Term, Final, Quiz
  subject: String,         // Subject name
  classId: ObjectId,       // Reference to Class
  teacherId: ObjectId,     // Reference to Teacher
  totalMarks: Number,      // Total marks
  passingMarks: Number,    // Passing marks
  duration: Number,        // Duration (minutes)
  scheduledDate: Date,     // Scheduled date
  startTime: String,       // Start time (HH:MM)
  endTime: String,         // End time (HH:MM)
  status: String,          // Scheduled, Ongoing, Completed, Cancelled
  isActive: Boolean,       // Active flag
  createdBy: ObjectId,     // Reference to User
  adminId: ObjectId,       // Reference to Admin
  testType: String,        // online/offline
  answers: Object,         // (Optional) Answer key
  pdfUrl: String           // (Optional) PDF for offline tests
}
```

## 4. Data Flow

### Test Creation Flow:
1. **Admin/Teacher** fills test form
2. **Frontend** validates input
3. **FormData** sent to backend
4. **Backend** validates permissions and class access
5. **Test** record created in database
6. **Response** returned with test details
7. **Frontend** updates test list

### Test Attempt Flow (Online):
1. **Student** views available tests
2. **Student** attempts test within scheduled window
3. **Answers** submitted to backend
4. **Test attempt** recorded (see analytics)
5. **Score** calculated and stored

### Permission Flow:
- **Admin:** Full access to all tests
- **Teacher:** Access to assigned classes, own tests
- **Student:** Access to visible tests in enrolled classes

## 5. Page Flow

### Admin/Teacher Page Flow:
```
Dashboard → Tests → [List/Add/Edit/Delete]
├── Test List (All/assigned classes)
├── Add Test (Form)
├── Edit Test (Own tests)
├── Delete Test (Own tests)
└── Filter by Class/Type/Search
```

### Student Page Flow:
```
Dashboard → Tests → [List/Attempt/View Results]
├── Test List (Enrolled classes)
├── Attempt Test (Online)
├── View Test Details/Results
```

## 6. API Endpoints
- `GET /api/tests` - Get tests (role-based filtering)
- `GET /api/tests/:id` - Get single test
- `POST /api/tests` - Create new test (Admin/Teacher)
- `PUT /api/tests/:id` - Update test (Admin/Teacher - owner only)
- `DELETE /api/tests/:id` - Delete test (Admin/Teacher - owner only)

## 7. Security & Validation
- Role-based permissions
- Input validation (type, date, time)
- Class/teacher assignment checks
- Test status management

## 8. Future Enhancements
- Bulk test import
- Question bank integration
- Auto-grading for online tests
- Test result analytics
- Notification integration 
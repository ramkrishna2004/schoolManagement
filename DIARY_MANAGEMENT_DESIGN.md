# Diary Management System Design

## Overview
The Diary Management System allows teachers and admins to record and share daily classwork, homework, and notes with students. It supports role-based access and class linkage.

## 1. Diary Management Functionalities

### For Admin:
- **View All Diaries:** Access all class diaries
- **Edit/Delete Diaries:** Manage any diary entry

### For Teacher:
- **Create Diary:** Add daily diary entries for assigned classes
- **Edit/Delete Own Diaries:** Manage their own diary entries

### For Student:
- **View Diaries:** View class diaries for enrolled classes

## 2. Components Structure

### Backend Components:
```
server/
├── models/
│   └── Diary.js                # Diary data model
├── controllers/
│   └── diaryController.js      # Diary business logic
├── routes/
│   └── diaryRoutes.js          # Diary API endpoints
```

### Frontend Components:
```
client/src/
├── components/
│   └── DiaryList.js            # Diary listing
│   └── DiaryForm.js            # Add/Edit diary form
├── pages/
│   └── DiaryPage.js            # Diary management page
```

## 3. Data Model

### Diary Model (server/models/Diary.js):
```javascript
{
  classId: ObjectId,        // Reference to Class
  createdBy: ObjectId,      // Reference to Teacher/Admin
  createdByRole: String,    // 'Teacher' or 'Admin'
  entries: [
    {
      subject: String,      // Subject name
      work: String          // Work/notes
    }
  ],
  date: Date,               // Diary date
  adminId: ObjectId         // Reference to Admin
}
```

## 4. Data Flow

### Diary Creation Flow:
1. **Teacher/Admin** fills diary form
2. **Frontend** validates input
3. **FormData** sent to backend
4. **Backend** creates diary record
5. **Frontend** updates diary list

### Permission Flow:
- **Admin:** Full access to all diaries
- **Teacher:** Access to assigned classes, own diaries
- **Student:** Access to class diaries

## 5. Page Flow

### Teacher/Admin Page Flow:
```
Dashboard → Diaries → [List/Add/Edit/Delete]
├── Diary List
├── Add/Edit Diary
├── Delete Diary
```

### Student Page Flow:
```
Dashboard → Diaries → [View]
├── View Class Diaries
```

## 6. API Endpoints
- `GET /api/diaries` - Get diaries
- `POST /api/diaries` - Add diary
- `PUT /api/diaries/:id` - Update diary
- `DELETE /api/diaries/:id` - Delete diary

## 7. Security & Validation
- Role-based permissions
- Input validation
- Class/teacher assignment checks

## 8. Future Enhancements
- Diary notifications
- Attachments (images, files)
- Student comments/acknowledgement 
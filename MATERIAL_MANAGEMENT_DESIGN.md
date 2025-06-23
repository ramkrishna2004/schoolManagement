# Material Management System Design

## Overview
The Material Management System is a comprehensive solution for managing educational materials in the School Management System (SMS). It provides role-based access control, file upload capabilities, analytics, and organized material categorization.

## 1. Material Management Functionalities

### For Admin:
- **CRUD Operations**: Create, Read, Update, Delete materials for any class
- **Class Assignment**: Assign materials to specific classes across the system
- **Material Categories**: Manage material categories and types (lecture, assignment, study_guide, reference, other)
- **Global Access**: View all materials across all classes
- **Bulk Operations**: Support for bulk upload and management
- **Permission Control**: Set material access permissions and visibility
- **Analytics**: View detailed analytics for all materials
- **User Management**: Monitor teacher and student material usage

### For Teacher:
- **Restricted Upload**: Add materials only to assigned classes
- **Ownership Control**: Update and delete only materials they created
- **Class-Specific View**: View materials in their assigned classes only
- **Topic Organization**: Organize materials by topics/chapters
- **Visibility Control**: Set material visibility for students
- **Analytics**: View analytics for their uploaded materials
- **File Management**: Upload various file types (PDF, DOC, PPT, Images, Videos)

### For Student:
- **Enrolled Class Access**: View materials for enrolled classes only
- **Download/View**: Download and view materials
- **Search & Filter**: Search and filter materials by category, topic, tags
- **Access Tracking**: Track material access history
- **Visible Materials**: Access only materials marked as visible by teachers

## 2. Components Structure

### Backend Components:
```
server/
├── models/
│   ├── Material.js              # Material data model
│   └── MaterialAccess.js        # Access tracking model
├── controllers/
│   └── materialController.js    # Business logic
├── routes/
│   └── materialRoutes.js        # API endpoints
└── uploads/
    └── materials/               # File storage directory
```

### Frontend Components:
```
client/src/
├── components/
│   ├── MaterialList.js          # Material listing with filters
│   ├── MaterialForm.js          # Add/Edit material form
│   └── MaterialAnalytics.js     # Analytics dashboard
├── services/
│   └── materialService.js       # API service layer
└── utils/
    └── formatters.js            # Utility functions
```

## 3. Data Models

### Material Model:
```javascript
{
  title: String,                 // Material title
  description: String,           // Material description
  fileUrl: String,              // File path
  fileName: String,             // Original filename
  fileSize: Number,             // File size in bytes
  fileType: String,             // MIME type
  classId: ObjectId,            // Reference to Class
  uploadedBy: ObjectId,         // Reference to Admin/Teacher
  uploadedByModel: String,      // 'Admin' or 'Teacher'
  category: String,             // lecture, assignment, study_guide, reference, other
  topic: String,                // Optional topic
  isVisible: Boolean,           // Student visibility
  tags: [String],               // Searchable tags
  downloadCount: Number,        // Download counter
  createdAt: Date,              // Creation timestamp
  updatedAt: Date               // Last update timestamp
}
```

### MaterialAccess Model:
```javascript
{
  materialId: ObjectId,         // Reference to Material
  studentId: ObjectId,          // Reference to Student
  classId: ObjectId,            // Reference to Class
  accessType: String,           // 'view' or 'download'
  accessedAt: Date,             // Access timestamp
  ipAddress: String,            // IP address
  userAgent: String             // Browser info
}
```

## 4. Data Flow

### Material Upload Flow:
1. **Teacher/Admin** selects file and fills form
2. **Frontend** validates file size and type
3. **FormData** sent to backend with file and metadata
4. **Backend** validates permissions and class access
5. **File** saved to uploads/materials directory
6. **Material** record created in database
7. **Response** returned with material details
8. **Frontend** redirects to materials list

### Material Access Flow:
1. **Student** requests material download
2. **Backend** validates enrollment and visibility
3. **Access** recorded in MaterialAccess collection
4. **Download count** incremented
5. **File** streamed to student
6. **Analytics** updated for reporting

### Permission Flow:
1. **Admin**: Full access to all materials across all classes
2. **Teacher**: Access only to materials in assigned classes, can only modify own materials
3. **Student**: Access only to visible materials in enrolled classes

## 5. Page Flow

### Admin Page Flow:
```
Dashboard → Materials → [List/Add/Edit/Delete/Analytics]
├── Materials List (All classes)
├── Add Material (Any class)
├── Edit Material (Any material)
├── Delete Material (Any material)
├── View Analytics (Any material)
└── Filter by Class/Category/Search
```

### Teacher Page Flow:
```
Dashboard → Materials → [List/Add/Edit/Delete/Analytics]
├── Materials List (Assigned classes only)
├── Add Material (Assigned classes only)
├── Edit Material (Own materials only)
├── Delete Material (Own materials only)
├── View Analytics (Own materials only)
└── Filter by Category/Search
```

### Student Page Flow:
```
Dashboard → Materials → [List/Download/View]
├── Materials List (Enrolled classes, visible only)
├── Download Material (Enrolled classes, visible only)
├── View Material Details
└── Filter by Category/Search
```

## 6. API Endpoints

### Material Management:
- `GET /api/materials` - Get materials (with role-based filtering)
- `GET /api/materials/:id` - Get single material
- `POST /api/materials` - Create new material (Admin/Teacher)
- `PUT /api/materials/:id` - Update material (Admin/Teacher - owner only)
- `DELETE /api/materials/:id` - Delete material (Admin/Teacher - owner only)
- `GET /api/materials/:id/download` - Download material
- `GET /api/materials/:id/analytics` - Get analytics (Admin/Teacher - owner only)

## 7. Security Features

### File Upload Security:
- File type validation (whitelist)
- File size limits (50MB max)
- Secure file naming (unique suffixes)
- Virus scanning capability (extensible)

### Access Control:
- Role-based permissions
- Class enrollment validation
- Material ownership validation
- Visibility controls

### Data Protection:
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

## 8. Analytics & Reporting

### Material Analytics:
- Total views and downloads
- Unique student access
- Access history with timestamps
- IP address tracking
- User agent information

### Usage Patterns:
- Most accessed materials
- Popular categories
- Student engagement metrics
- Teacher upload patterns

## 9. File Management

### Supported File Types:
- Documents: PDF, DOC, DOCX
- Presentations: PPT, PPTX
- Spreadsheets: XLS, XLSX
- Text: TXT
- Images: JPG, JPEG, PNG, GIF
- Videos: MP4, AVI, MOV

### Storage Structure:
```
uploads/
└── materials/
    ├── file-1234567890-123456789.pdf
    ├── file-1234567890-123456790.docx
    └── file-1234567890-123456791.pptx
```

## 10. User Experience Features

### Material List Features:
- Advanced filtering (category, class, search)
- Pagination support
- Sort by date, title, size
- Category color coding
- Visibility indicators
- Download/Edit/Delete actions

### Form Features:
- Drag & drop file upload
- File type validation
- Progress indicators
- Auto-save drafts
- Rich text descriptions
- Tag suggestions

### Analytics Features:
- Visual charts and graphs
- Export capabilities
- Real-time updates
- Comparative analysis
- Trend identification

## 11. Integration Points

### Class Integration:
- Materials linked to specific classes
- Teacher assignment validation
- Student enrollment checking

### User Integration:
- Role-based access control
- User activity tracking
- Permission inheritance

### Notification System:
- Material upload notifications
- Access alerts
- Usage reports

## 12. Future Enhancements

### Planned Features:
- Bulk upload functionality
- Material versioning
- Collaborative editing
- Advanced search (full-text)
- Material recommendations
- Mobile app support
- Offline access
- Integration with LMS systems

### Scalability Considerations:
- Cloud storage integration
- CDN for file delivery
- Database optimization
- Caching strategies
- Load balancing

This Material Management System provides a robust, secure, and user-friendly solution for managing educational materials with comprehensive role-based access control and analytics capabilities. 
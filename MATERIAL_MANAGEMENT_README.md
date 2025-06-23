# Material Management System - User Guide

## Overview
The Material Management System allows teachers and administrators to upload, organize, and manage educational materials for their classes. Students can access and download materials for their enrolled classes.

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB running
- Server and client applications running

### Installation
1. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

2. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

3. Create uploads directory:
   ```bash
   cd server
   mkdir -p uploads/materials
   ```

4. Start the server:
   ```bash
   cd server
   npm run dev
   ```

5. Start the client:
   ```bash
   cd client
   npm start
   ```

## User Roles and Permissions

### Admin
- **Full Access**: Can manage materials for all classes
- **CRUD Operations**: Create, read, update, delete any material
- **Analytics**: View analytics for all materials
- **Class Assignment**: Assign materials to any class

### Teacher
- **Restricted Access**: Can only manage materials for assigned classes
- **Ownership Control**: Can only edit/delete materials they uploaded
- **Upload Permissions**: Can upload materials to assigned classes only
- **Analytics**: View analytics for their own materials

### Student
- **Read Access**: Can view and download materials for enrolled classes
- **Visibility Filter**: Can only see materials marked as visible
- **Download Tracking**: Access is tracked for analytics

## Features

### Material Upload
1. Navigate to `/materials`
2. Click "Add New Material"
3. Fill in the form:
   - **Title**: Material title (required)
   - **Description**: Optional description
   - **Class**: Select the target class
   - **Category**: Choose from lecture, assignment, study_guide, reference, other
   - **Topic**: Optional topic/chapter
   - **Tags**: Comma-separated tags for search
   - **File**: Upload file (max 50MB)
   - **Visibility**: Toggle student visibility

### Supported File Types
- **Documents**: PDF, DOC, DOCX
- **Presentations**: PPT, PPTX
- **Spreadsheets**: XLS, XLSX
- **Text**: TXT
- **Images**: JPG, JPEG, PNG, GIF
- **Videos**: MP4, AVI, MOV

### Material Management
- **List View**: Browse all materials with filters
- **Search**: Search by title, description, topic, or tags
- **Filter**: Filter by category and class
- **Edit**: Update material details (except file)
- **Delete**: Remove materials (with confirmation)
- **Download**: Download materials directly

### Analytics
- **Access Tracking**: Monitor downloads and views
- **Student Activity**: Track which students access materials
- **Usage Patterns**: Identify popular materials
- **Access History**: Detailed access logs with timestamps

## API Endpoints

### Material Management
- `GET /api/materials` - Get materials (with role-based filtering)
- `GET /api/materials/:id` - Get single material
- `POST /api/materials` - Create new material (Admin/Teacher)
- `PUT /api/materials/:id` - Update material (Admin/Teacher - owner only)
- `DELETE /api/materials/:id` - Delete material (Admin/Teacher - owner only)
- `GET /api/materials/:id/download` - Download material
- `GET /api/materials/:id/analytics` - Get analytics (Admin/Teacher - owner only)

## File Storage

### Directory Structure
```
server/
└── uploads/
    └── materials/
        ├── file-1234567890-123456789.pdf
        ├── file-1234567890-123456790.docx
        └── file-1234567890-123456791.pptx
```

### Security Features
- **File Type Validation**: Whitelist of allowed file types
- **Size Limits**: Maximum 50MB per file
- **Secure Naming**: Unique file names with timestamps
- **Access Control**: Role-based file access

## Troubleshooting

### Common Issues

1. **File Upload Fails**
   - Check file size (max 50MB)
   - Verify file type is supported
   - Ensure uploads directory exists and is writable

2. **Permission Denied**
   - Verify user role and permissions
   - Check if teacher is assigned to the class
   - Ensure material is visible (for students)

3. **Material Not Found**
   - Check if material exists
   - Verify class enrollment (for students)
   - Ensure proper access permissions

4. **Download Issues**
   - Check if file exists on server
   - Verify file path is correct
   - Ensure proper authentication

### Error Messages
- `"File size must be less than 50MB"` - Reduce file size
- `"Invalid file type"` - Use supported file format
- `"Access denied"` - Check user permissions
- `"Class not found"` - Verify class exists
- `"Material not found"` - Check material ID

## Best Practices

### For Teachers
- Use descriptive titles and descriptions
- Organize materials with appropriate categories
- Add relevant tags for better searchability
- Set visibility appropriately for students
- Regularly review and update materials

### For Admins
- Monitor material usage and analytics
- Ensure proper file organization
- Review teacher uploads for quality
- Manage storage space efficiently
- Backup important materials

### For Students
- Use search and filter features effectively
- Download materials for offline access
- Respect copyright and usage policies
- Report any issues with materials

## Future Enhancements

### Planned Features
- Bulk upload functionality
- Material versioning
- Collaborative editing
- Advanced search (full-text)
- Material recommendations
- Mobile app support
- Offline access
- Integration with LMS systems

### Technical Improvements
- Cloud storage integration
- CDN for file delivery
- Database optimization
- Caching strategies
- Load balancing

## Support

For technical support or questions about the Material Management System:
1. Check this documentation
2. Review error messages carefully
3. Verify user permissions and roles
4. Contact system administrator

## Security Notes

- All file uploads are validated for type and size
- Access is controlled by user roles and class enrollment
- File downloads are logged for security auditing
- IP addresses are tracked for access monitoring
- Materials can be made invisible to students when needed 
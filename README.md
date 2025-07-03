# Student Management System (SMS)

A modern, full-featured web application for managing students, teachers, classes, tests, materials, analytics, and more. Built with the MERN stack (MongoDB, Express.js, React, Node.js), SMS is designed for schools and educational organizations seeking scalable, secure, and role-based management.

---

## 🚀 Core Features
- **Role-based dashboards** for Admin, Teacher, Student, and SuperAdmin
- **Class, test, and score management** (online/offline)
- **Material management** with Google Drive/external links and analytics
- **Attendance, schedules, announcements, diaries, holidays**
- **Leaderboards and analytics** (performance, test stats)
- **Multi-tenant organization isolation**
- **Responsive UI** (React, Tailwind CSS, MUI)
- **Secure authentication** (JWT, bcrypt, role checks)

---

## 🏗️ Tech Stack
- **Frontend:** React, Tailwind CSS, Material UI, Axios, Chart.js
- **Backend:** Node.js, Express.js, Mongoose, MongoDB
- **Authentication:** JWT, bcryptjs
- **Other:** Multer (file upload), Helmet, CORS, Rate Limiting

---

## 📁 Project Structure
```
/d:/sms_old/
├── client/      # Frontend (React)
├── server/      # Backend (Express.js, MongoDB)
├── docs.md      # Full project documentation
├── MATERIAL_MANAGEMENT_README.md  # Material module user guide
├── MATERIAL_MANAGEMENT_DESIGN.md  # Material module design
└── README.md    # (this file)
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v14+)
- npm (v6+)
- MongoDB (local or cloud)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd sms_old
```

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file with:
# MONGO_URI=mongodb://localhost:27017/sms
# JWT_SECRET=your_jwt_secret
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
# Create a .env file with:
# REACT_APP_API_URL=http://localhost:5000
npm start
```

- Frontend: http://localhost:3000
- Backend:  http://localhost:5000

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- (Optional) `PORT` - Server port (default: 5000)

### Frontend (`client/.env`)
- `REACT_APP_API_URL` - Backend API base URL

---

## 🧩 Main Modules
- **Authentication & RBAC:** Secure login, JWT, role-based access
- **User Management:** Admins, Teachers, Students, SuperAdmins
- **Class & Test Management:** CRUD for classes, tests, scores
- **Material Management:** Upload, organize, and share materials via Google Drive/external links ([see MATERIAL_MANAGEMENT_README.md](./MATERIAL_MANAGEMENT_README.md))
- **Analytics:** Track material views/downloads, test performance, leaderboards
- **Attendance & Schedules:** Mark/view attendance, manage class schedules
- **Announcements & Diaries:** School/class announcements, teacher/student diaries

---

## 📚 Documentation
- [Full Project Docs](./docs.md)
- [Material Management User Guide](./MATERIAL_MANAGEMENT_README.md)
- [Material Management Design](./MATERIAL_MANAGEMENT_DESIGN.md)

---

## 🛠️ Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 🐞 Troubleshooting
- Ensure MongoDB is running and accessible
- Check `.env` files in both `server/` and `client/`
- For CORS issues, update allowed origins in `server/app.js`
- For material upload/view issues, see [Material Management Guide](./MATERIAL_MANAGEMENT_README.md)

---

## 📄 License
This project is for educational and non-commercial use. See LICENSE if present.

---

## 🙏 Acknowledgements
- MERN stack community
- Open source contributors

---

For detailed API, data models, and advanced usage, see [docs.md](./docs.md). 
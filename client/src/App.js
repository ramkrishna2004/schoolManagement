import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Tests from './pages/teacher/Tests';
import TestDetails from './pages/teacher/TestDetails';
import NewTest from './pages/teacher/NewTest';
import EditTest from './pages/teacher/EditTest';
import Questions from './pages/teacher/Questions';
import StudentTests from './pages/student/Tests';
import StudentClasses from './pages/student/Classes';
import TakeTest from './pages/student/TakeTest';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminRoute from './components/AdminRoute';
import TeacherRoute from './components/TeacherRoute';
import StudentRoute from './components/StudentRoute';
import RegistrationType from './pages/RegistrationType';
import Classes from './components/Classes';
import ClassForm from './components/ClassForm';
import ClassDetails from './components/ClassDetails';
import ClassSchedule from './components/ClassSchedule';
import TeacherScores from './pages/teacher/Scores';
import StudentScores from './pages/student/Scores';
import MaterialList from './components/MaterialList';
import MaterialForm from './components/MaterialForm';
import MaterialAnalytics from './components/MaterialAnalytics';
import TeacherList from './pages/TeacherList';
import StudentList from './pages/StudentList';
import AdminScores from './pages/AdminScores';
import TestResult from './pages/student/TestResult';
import Announcements from './pages/admin/Announcements';
import Footer from './components/layout/Footer';
import About from './pages/About';
import AboutWebsite from './pages/AboutWebsite';
import TeacherDiaryPage from './pages/TeacherDiaryPage';
import AdminDiaryPage from './pages/AdminDiaryPage';
import StudentDiaryPage from './pages/StudentDiaryPage';
import Profile from './pages/Profile';
import { StudentAttendanceWrapper, TeacherMarkAttendanceWrapper } from './components/AttendanceWrappers';
import AdminHolidays from './components/AdminHolidays';
import StudentAnalytics from './pages/student/StudentAnalytics';
import TeacherAnalytics from './pages/teacher/TeacherAnalytics';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import OfflineTestForm from './components/OfflineTestForm';
import ManualScoreEntry from './components/ManualScoreEntry';

function ScoresWrapper() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'admin') return <AdminScores />;
  if (user.role === 'teacher') return <TeacherScores />;
  if (user.role === 'student') return <StudentScores />;
  return null;
}

function ContactUs() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-bold text-sky-800 mb-4">Contact Us</h1>
      <p className="text-lg text-blue-900">For any queries or support, reach out:</p>
      <div className="mt-4 text-lg">
        <div>📞 <span className="font-semibold">9059448685</span></div>
        <div>✉️ <span className="font-semibold">mnrkchari@gmail.com</span></div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-100 to-white flex flex-col">
          <Navbar />
          <main className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin-register" element={<AdminRegister />} />
              <Route
                path="/register"
                element={
                  <PrivateRoute roles={['admin']}>
                    <Register />
                  </PrivateRoute>
                }
              />
              <Route
                path="/register-type"
                element={
                  <PrivateRoute roles={['admin']}>
                    <RegistrationType />
                  </PrivateRoute>
                }
              />

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/teacher/dashboard"
                element={
                  <TeacherRoute>
                    <TeacherDashboard />
                  </TeacherRoute>
                }
              />

              <Route
                path="/student/dashboard"
                element={
                  <StudentRoute>
                    <StudentDashboard />
                  </StudentRoute>
                }
              />

              {/* Test Routes */}
              <Route
                path="/tests"
                element={
                  <PrivateRoute roles={['admin', 'teacher']}>
                    <Tests />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tests/new"
                element={
                  <PrivateRoute roles={['admin', 'teacher']}>
                    <NewTest />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tests/:id"
                element={
                  <PrivateRoute roles={['admin', 'teacher']}>
                    <TestDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tests/:id/edit"
                element={
                  <PrivateRoute roles={['admin', 'teacher']}>
                    <EditTest />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tests/:id/questions"
                element={
                  <PrivateRoute roles={['admin', 'teacher']}>
                    <Questions />
                  </PrivateRoute>
                }
              />

              {/* Student Test Routes */}
              <Route
                path="/student/tests"
                element={
                  <StudentRoute>
                    <StudentTests />
                  </StudentRoute>
                }
              />
              <Route
                path="/student/tests/:id/take"
                element={
                  <StudentRoute>
                    <TakeTest />
                  </StudentRoute>
                }
              />
              <Route
                path="/student/tests/:id/results"
                element={
                  <StudentRoute>
                    <TestResult />
                  </StudentRoute>
                }
              />
              <Route
                path="/student/classes"
                element={
                  <StudentRoute>
                    <StudentClasses />
                  </StudentRoute>
                }
              />

              {/* Class Routes */}
              <Route
                path="/classes"
                element={
                  <PrivateRoute roles={['admin', 'teacher']}>
                    <Classes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/classes/new"
                element={
                  <PrivateRoute roles={['admin']}>
                    <ClassForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/classes/:id"
                element={
                  <PrivateRoute roles={['admin', 'teacher']}>
                    <ClassDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/classes/:id/edit"
                element={
                  <PrivateRoute roles={['admin']}>
                    <ClassForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/schedules"
                element={
                  <PrivateRoute roles={['admin', 'teacher']}>
                    <ClassSchedule />
                  </PrivateRoute>
                }
              />

              {/* Scores Routes */}
              <Route
                path="/scores"
                element={
                  <PrivateRoute>
                    <ScoresWrapper />
                  </PrivateRoute>
                }
              />

              {/* Material Routes */}
              <Route
                path="/materials"
                element={
                  <PrivateRoute roles={['admin', 'teacher', 'student']}>
                    <MaterialList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/materials/new"
                element={
                  <PrivateRoute roles={['admin', 'teacher']}>
                    <MaterialForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/materials/:id/edit"
                element={
                  <PrivateRoute roles={['admin', 'teacher']}>
                    <MaterialForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/materials/:id/analytics"
                element={
                  <PrivateRoute roles={['admin', 'teacher']}>
                    <MaterialAnalytics />
                  </PrivateRoute>
                }
              />

              <Route
                path="/teachers"
                element={
                  <PrivateRoute roles={['admin', 'teacher']}>
                    <TeacherList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <PrivateRoute roles={['admin', 'teacher']}>
                    <StudentList />
                  </PrivateRoute>
                }
              />

              <Route path="/admin/announcements" element={<AdminRoute><Announcements /></AdminRoute>} />
              <Route path="/about" element={<AboutWebsite />} />
              <Route path="/aboutUs" element={<About />} />    
              <Route path="/contact" element={<ContactUs />} />

              <Route
                path="/teacher/diary"
                element={
                  <TeacherRoute>
                    <TeacherDiaryPage />
                  </TeacherRoute>
                }
              />
              <Route
                path="/admin/diary"
                element={
                  <AdminRoute>
                    <AdminDiaryPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/student/diary"
                element={
                  <StudentRoute>
                    <StudentDiaryPage />
                  </StudentRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* Attendance Management Routes */}
              <Route
                path="/student/attendance"
                element={
                  <StudentRoute>
                    <StudentAttendanceWrapper />
                  </StudentRoute>
                }
              />
              <Route
                path="/teacher/attendance"
                element={
                  <TeacherRoute>
                    <TeacherMarkAttendanceWrapper />
                  </TeacherRoute>
                }
              />
              <Route
                path="/admin/holidays"
                element={
                  <AdminRoute>
                    <AdminHolidays />
                  </AdminRoute>
                }
              />

              {/* Analytics Routes */}
              <Route
                path="/student/analytics"
                element={
                  <StudentRoute>
                    <StudentAnalytics />
                  </StudentRoute>
                }
              />
              <Route
                path="/teacher/analytics/:classId"
                element={
                  <TeacherRoute>
                    <TeacherAnalytics />
                  </TeacherRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <AdminRoute>
                    <AdminAnalytics />
                  </AdminRoute>
                }
              />

              <Route
                path="/superadmin/dashboard"
                element={
                  <PrivateRoute roles={['superadmin']}>
                    <SuperAdminDashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/teacher/tests/offline/new"
                element={
                  <PrivateRoute roles={['teacher']}>
                    <OfflineTestForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/teacher/tests/:id/score-entry"
                element={
                  <PrivateRoute roles={['teacher']}>
                    <ManualScoreEntry testId={window.location.pathname.split('/').at(-2)} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/tests/:id/score-entry"
                element={
                  <PrivateRoute roles={['admin']}>
                    <ManualScoreEntry testId={window.location.pathname.split('/').at(-2)} />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 
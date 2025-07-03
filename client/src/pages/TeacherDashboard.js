import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import AnnouncementList from '../components/AnnouncementList';
import { announcementService } from '../services/announcementService';
import api from '../config/api';

function TeacherDashboard() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementService.getAnnouncements();
        setAnnouncements(data);
      } catch (e) {
        // Optionally log error or ignore
      }
    };
    const fetchClasses = async () => {
        try {
            const res = await api.get('/api/classes');
            setClasses(res.data.data);
        } catch (error) {
            console.error('Failed to fetch classes', error);
        }
    }
    fetchAnnouncements();
    fetchClasses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <AnnouncementList announcements={announcements} />
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Teacher Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tests Section */}
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-indigo-900 mb-4">Tests</h2>
            <p className="text-indigo-700">Create and manage your tests</p>
            <Link
              to="/teacher/tests"
              className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Manage Tests
            </Link>
          </div>

          {/* Diary Section */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Class Diary</h2>
            <p className="text-blue-700">Create and manage class diaries</p>
            <Link
              to="/teacher/diary"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Manage Diary
            </Link>
          </div>

          {/* Results Section */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-green-900 mb-4">Results</h2>
            <p className="text-green-700">View and analyze test results</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              View Results
            </button>
          </div>
          {/* Analytics Section */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-purple-900 mb-4">Test Analytics</h2>
            <p className="text-purple-700">Visualize test performance for your classes</p>
            {classes.length > 0 ? (
              <Link
                to={`/teacher/analytics/${classes[0]._id}`}
                className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                View Analytics
              </Link>
            ) : (
              <p className="text-purple-700 mt-4">No classes assigned.</p>
            )}
          </div>
        </div>

        {/* Teacher Info */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Teacher Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Qualifications</p>
              <p className="font-medium">{user.roleDetails?.qualifications}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Contact</p>
              <p className="font-medium">{user.roleDetails?.contact}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard; 
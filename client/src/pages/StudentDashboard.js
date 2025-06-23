import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import AnnouncementList from '../components/AnnouncementList';
import { announcementService } from '../services/announcementService';

function StudentDashboard() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementService.getAnnouncements();
        setAnnouncements(data);
      } catch (e) {
        // Optionally log error or ignore
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <AnnouncementList announcements={announcements} />
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Student Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tests Section */}
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-indigo-900 mb-4">Available Tests</h2>
            <p className="text-indigo-700">Take tests assigned to you</p>
            <Link
              to="/student/tests"
              className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              View Tests
            </Link>
          </div>

          {/* Diary Section */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Class Diary</h2>
            <p className="text-blue-700">View your class diary entries</p>
            <Link
              to="/student/diary"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Diary
            </Link>
          </div>

          {/* Results Section */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-green-900 mb-4">My Results</h2>
            <p className="text-green-700">View your test results and progress</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              View Results
            </button>
          </div>

          {/* Analytics Section */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-purple-900 mb-4">Test Analytics</h2>
            <p className="text-purple-700">Visualize your test performance</p>
            <Link
              to="/student/analytics"
              className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              View Analytics
            </Link>
          </div>
        </div>

        {/* Student Info */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h2>
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
              <p className="text-sm text-gray-600">Parent Contact</p>
              <p className="font-medium">{user.roleDetails?.parentContact}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">{user.roleDetails?.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard; 
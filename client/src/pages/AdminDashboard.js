import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Quick actions for admin
  const quickActions = [
    {
      label: 'Manage Announcements',
      onClick: () => navigate('/admin/announcements'),
      className: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      label: 'Create Announcement',
      onClick: () => navigate('/admin/announcements', { state: { openForm: true } }),
      className: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      label: 'Manage Class Diaries',
      onClick: () => navigate('/admin/diary'),
      className: 'bg-blue-800 hover:bg-blue-900',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        
        {/* Quick Actions */}
        <div className="mb-6 flex gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className={`px-4 py-2 rounded shadow text-white font-semibold transition ${action.className}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Teachers Section */}
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-indigo-900 mb-4">Teachers</h2>
            <p className="text-indigo-700">Manage teachers and their accounts</p>
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              View Teachers
            </button>
          </div>

          {/* Students Section */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-green-900 mb-4">Students</h2>
            <p className="text-green-700">Manage students and their accounts</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              View Students
            </button>
          </div>

          {/* Tests Section */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-purple-900 mb-4">Tests</h2>
            <p className="text-purple-700">Manage and monitor all tests</p>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              View Tests
            </button>
          </div>

          {/* Analytics Section */}
          <div className="bg-teal-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-teal-900 mb-4">Test Analytics</h2>
            <p className="text-teal-700">Get insights into test performance</p>
            <Link to="/admin/analytics" className="mt-4 inline-block bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
              View Analytics
            </Link>
          </div>
        </div>

        {/* Admin Info */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Information</h2>
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
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-medium">{user.roleDetails?.department}</p>
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

export default AdminDashboard; 
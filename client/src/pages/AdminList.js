import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from '../components/UserList';
import { useAuth } from '../context/AuthContext';

function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admins', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAdmins(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching admins');
      setLoading(false);
    }
  };

  const handleToggleStatus = async (adminId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admins/${adminId}`,
        { isActive: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setAdmins(admins.map(admin => 
        admin._id === adminId ? { ...admin, isActive: newStatus } : admin
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating admin status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Admins</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all admins in the system including their name, email, organization, and status.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <UserList
          users={admins}
          userType="admin"
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </div>
  );
}

export default AdminList; 
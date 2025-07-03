import React, { useState, useEffect } from 'react';
import ClassList from '../components/ClassList';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';


function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/classes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setClasses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch classes. Please try again later.');
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }

    try {
      await api.delete(`/api/classes/${classId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setClasses(classes.filter(c => c._id !== classId));
    } catch (err) {
      setError('Failed to delete class. Please try again later.');
      console.error('Error deleting class:', err);
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
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Classes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your classes and their enrollments
          </p>
        </div>
      </div>

      <div className="mt-8">
        <ClassList classes={classes} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default Classes; 
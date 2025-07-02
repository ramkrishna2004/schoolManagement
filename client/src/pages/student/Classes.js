import React, { useState, useEffect } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';


function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/students/enrolled-classes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClasses(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch enrolled classes. Please try again later.');
        console.error('Error fetching classes:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchClasses();
    }
  }, [token]);

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
            My Classes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View your enrolled classes and their details
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="shadow-2xl rounded-3xl border-2 border-sky-200 overflow-hidden">
          <table className="min-w-full divide-y divide-sky-200">
            <thead className="bg-gradient-to-r from-sky-200 to-sky-100">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Class Name</th>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Subject</th>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {classes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-8 py-6 text-center text-base text-gray-500">No classes found</td>
                </tr>
              ) : (
                classes.map((classItem, idx) => (
                  <tr key={classItem._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50 hover:bg-sky-100 transition'}>
                    <td className="px-8 py-5 whitespace-nowrap text-blue-900 font-semibold text-base">{classItem.className}</td>
                    <td className="px-8 py-5 whitespace-nowrap text-blue-800 text-base">{classItem.subjectName}</td>
                    <td className="px-8 py-5 whitespace-nowrap text-blue-700 text-base">{classItem.teacherId?.name || 'Not assigned'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Classes; 
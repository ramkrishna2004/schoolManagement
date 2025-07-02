import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestForm from '../../components/TestForm';
import api from '../../config/api';


function NewTest() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/classes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setClasses(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch classes');
      setLoading(false);
    }
  };

  const handleSubmit = async (testData) => {
    try {
      await api.post('/api/tests', testData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      navigate('/tests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create test');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Create New Test
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add a new test with questions and answers
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-8">
        <TestForm
          classes={classes}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tests')}
        />
      </div>
    </div>
  );
}

export default NewTest; 
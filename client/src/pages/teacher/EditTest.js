import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/api';
import TestForm from '../../components/TestForm';


function EditTest() {
  const [test, setTest] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchTest = useCallback(async () => {
    try {
      const response = await api.get(`/api/tests/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTest(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch test');
      setLoading(false);
    }
  }, [id]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/classes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setClasses(response.data.data);
    } catch (err) {
      setError('Failed to fetch classes');
    }
  };

  useEffect(() => {
    fetchTest();
    fetchClasses();
  }, [fetchTest]);

  const handleSubmit = async (testData) => {
    try {
      await api.put(`/api/tests/${id}`, testData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      navigate('/teacher/tests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update test');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          Test not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Edit Test
          </h2>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-8">
        <TestForm
          initialData={test}
          classes={classes}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/teacher/tests')}
        />
      </div>
    </div>
  );
}

export default EditTest; 
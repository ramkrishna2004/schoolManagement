import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import TestForm from './TestForm';
import { useNavigate } from 'react-router-dom';


function TestManagement() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await api.get('/api/tests', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTests(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tests');
      setLoading(false);
    }
  };

  const handleCreateTest = async (testData) => {
    try {
      const response = await api.post('/api/tests', testData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTests([...tests, response.data.data]);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create test');
    }
  };

  const handleUpdateTest = async (testData) => {
    try {
      const response = await api.put(`/api/tests/${selectedTest._id}`, testData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTests(tests.map(test => 
        test._id === selectedTest._id ? response.data.data : test
      ));
      setSelectedTest(null);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update test');
    }
  };

  const handleDeleteTest = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await api.delete(`/api/tests/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTests(tests.filter(test => test._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete test');
      }
    }
  };

  const handleEdit = (test) => {
    setSelectedTest(test);
    setShowForm(true);
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
            Test Management
          </h2>
        </div>
        {user.role === 'admin' && (
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button
              onClick={() => {
                setSelectedTest(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Test
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="mt-8">
          <TestForm
            initialData={selectedTest}
            onSubmit={selectedTest ? handleUpdateTest : handleCreateTest}
            onCancel={() => {
              setShowForm(false);
              setSelectedTest(null);
            }}
          />
        </div>
      ) : (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Tests List
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tests.map((test) => (
                    <tr key={test._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {test.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {test.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {test.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(test.scheduledDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {test.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/teacher/tests/${test._id}/questions`)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Manage Questions
                        </button>
                        <button
                          onClick={() => handleEdit(test)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTest(test._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {tests.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No tests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestManagement; 
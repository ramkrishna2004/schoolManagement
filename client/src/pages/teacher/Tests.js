import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tests', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setTests(response.data.data);
      } else {
        setError('Failed to fetch tests');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tests:', err);
      setError(err.response?.data?.message || 'Failed to fetch tests');
      setLoading(false);
    }
  };

  const handleDeleteTest = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tests/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTests(tests.filter(test => test._id !== id));
      } catch (err) {
        setError('Failed to delete test');
      }
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
            Tests
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/tests/new"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Test
          </Link>
          <Link
            to="/teacher/tests/offline/new"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Offline Test
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow-2xl rounded-3xl border-2 border-sky-200">
              <table className="min-w-full divide-y divide-sky-200">
                <thead className="bg-gradient-to-r from-sky-200 to-sky-100">
                  <tr>
                    <th scope="col" className="py-4 pl-8 pr-3 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Title</th>
                    <th scope="col" className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Subject</th>
                    <th scope="col" className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Class</th>
                    <th scope="col" className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Type</th>
                    <th scope="col" className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Online/Offline</th>
                    <th scope="col" className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Date</th>
                    <th scope="col" className="py-4 pl-3 pr-8 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {tests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-8 py-6 text-center text-base text-gray-500">No tests found</td>
                    </tr>
                  ) : (
                    tests.map((test, idx) => (
                      <tr key={test._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50 hover:bg-sky-100 transition'}>
                        <td className="whitespace-nowrap py-5 pl-8 pr-3 text-base font-semibold text-blue-900">{test.title}</td>
                        <td className="whitespace-nowrap px-8 py-5 text-base text-blue-800">{test.subject}</td>
                        <td className="whitespace-nowrap px-8 py-5 text-base text-blue-800">{test.classId?.className}</td>
                        <td className="whitespace-nowrap px-8 py-5 text-base text-blue-800">{test.type}</td>
                        <td className="whitespace-nowrap px-8 py-5 text-base text-blue-800">{test.testType ? (test.testType.charAt(0).toUpperCase() + test.testType.slice(1)) : '-'}</td>
                        <td className="whitespace-nowrap px-8 py-5 text-base text-blue-700">{new Date(test.scheduledDate).toLocaleDateString()}</td>
                        <td className="relative whitespace-nowrap py-5 pl-3 pr-8 text-right text-base font-medium flex gap-3 justify-end">
                          <button
                            onClick={() => navigate(`/tests/${test._id}/questions`)}
                            className="bg-green-200 text-green-900 px-4 py-2 rounded-xl shadow hover:bg-green-300 font-semibold transition text-base"
                          >
                            Manage Questions
                          </button>
                          <Link
                            to={`/tests/${test._id}/edit`}
                            className="bg-yellow-200 text-yellow-900 px-4 py-2 rounded-xl shadow hover:bg-yellow-300 font-semibold transition text-base"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteTest(test._id)}
                            className="bg-red-200 text-red-800 px-4 py-2 rounded-xl shadow hover:bg-red-300 font-semibold transition text-base"
                          >
                            Delete
                          </button>
                          {/* Only show Enter Scores for teachers */}
                          {user?.role === 'teacher' && test.testType === 'offline' && (
                            <Link
                              to={`/teacher/tests/${test._id}/score-entry`}
                              className="bg-blue-200 text-blue-900 px-4 py-2 rounded-xl shadow hover:bg-blue-300 font-semibold transition text-base"
                            >
                              Enter Scores
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tests; 
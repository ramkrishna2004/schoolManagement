import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';


const PAGE_SIZE = 10;

function TestList() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTests();
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm]);

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
      setError(err.response?.data?.message || 'Failed to fetch tests');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tests/${id}`, {
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

  // Only show tests with scheduledDate today or in the future
  const now = new Date();
  const futureTests = tests.filter(test => {
    if (!test.scheduledDate) return false;
    const testDate = new Date(test.scheduledDate);
    // Remove time part for comparison
    testDate.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    return testDate >= now;
  });

  const filteredTests = futureTests.filter(test =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (test.class?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedTests = filteredTests.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil(filteredTests.length / PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sky-800">Tests</h1>
        {user.role === 'teacher' && (
          <Link
            to="/tests/new"
            className="bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700 transition"
          >
            Add Test
          </Link>
        )}
        {user.role === 'admin' && (
          <Link
            to="/admin/tests/offline/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition ml-2"
          >
            Create Offline Test
          </Link>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tests..."
          className="w-full px-4 py-2 border border-sky-200 rounded-md shadow-sm focus:border-sky-400 focus:ring-sky-400 bg-white text-blue-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border-2 border-sky-200 w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-sky-200">
            <thead className="bg-gradient-to-r from-sky-200 to-sky-100">
              <tr>
                <th className="px-4 sm:px-8 py-4 text-left text-xs sm:text-sm font-extrabold text-sky-800 uppercase tracking-widest">Title</th>
                <th className="px-4 sm:px-8 py-4 text-left text-xs sm:text-sm font-extrabold text-sky-800 uppercase tracking-widest">Subject</th>
                <th className="px-4 sm:px-8 py-4 text-left text-xs sm:text-sm font-extrabold text-sky-800 uppercase tracking-widest hidden md:table-cell">Class</th>
                <th className="px-4 sm:px-8 py-4 text-left text-xs sm:text-sm font-extrabold text-sky-800 uppercase tracking-widest hidden lg:table-cell">Scheduled Date</th>
                <th className="px-4 sm:px-8 py-4 text-left text-xs sm:text-sm font-extrabold text-sky-800 uppercase tracking-widest hidden lg:table-cell">Start Time</th>
                <th className="px-4 sm:px-8 py-4 text-left text-xs sm:text-sm font-extrabold text-sky-800 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTests.map((test, idx) => (
                <tr key={test._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50 hover:bg-sky-100 transition'}>
                  <td className="px-4 sm:px-8 py-5 whitespace-nowrap text-blue-900 font-semibold text-xs sm:text-base">{test.title}</td>
                  <td className="px-4 sm:px-8 py-5 whitespace-nowrap text-blue-800 text-xs sm:text-base">{test.subject}</td>
                  <td className="px-4 sm:px-8 py-5 whitespace-nowrap text-blue-800 text-xs sm:text-base hidden md:table-cell">{test.class?.name || 'Not Assigned'}</td>
                  <td className="px-4 sm:px-8 py-5 whitespace-nowrap text-blue-700 text-xs sm:text-base hidden lg:table-cell">{test.scheduledDate ? new Date(test.scheduledDate).toLocaleDateString() : ''}</td>
                  <td className="px-4 sm:px-8 py-5 whitespace-nowrap text-blue-700 text-xs sm:text-base hidden lg:table-cell">{test.startTime || '-'}</td>
                  <td className="px-4 sm:px-8 py-5 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        to={`/tests/${test._id}`}
                        className="bg-sky-200 text-sky-900 px-4 py-2 rounded-xl shadow hover:bg-sky-300 font-semibold transition text-xs sm:text-base text-center"
                      >
                        View
                      </Link>
                      {test.testType === 'offline' && (
                        <Link
                          to={
                            user.role === 'admin'
                              ? `/admin/tests/${test._id}/score-entry`
                              : `/teacher/tests/${test._id}/score-entry`
                          }
                          className="bg-green-200 text-green-900 px-4 py-2 rounded-xl shadow hover:bg-green-300 font-semibold transition text-xs sm:text-base text-center"
                        >
                          Enter Score
                        </Link>
                      )}
                      {user.role === 'teacher' && (
                        <>
                          <Link
                            to={`/tests/${test._id}/edit`}
                            className="bg-yellow-200 text-yellow-900 px-4 py-2 rounded-xl shadow hover:bg-yellow-300 font-semibold transition text-xs sm:text-base text-center"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(test._id)}
                            className="bg-red-200 text-red-800 px-4 py-2 rounded-xl shadow hover:bg-red-300 font-semibold transition text-xs sm:text-base text-center"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 border border-sky-200 rounded-xl p-3 bg-sky-50">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-sky-200 text-blue-900 font-semibold hover:bg-sky-300 disabled:opacity-50 transition"
          >
            Previous
          </button>
          <span className="font-semibold text-blue-900 text-lg">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-sky-200 text-blue-900 font-semibold hover:bg-sky-300 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default TestList; 
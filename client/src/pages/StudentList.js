import React, { useState, useEffect } from 'react';
import api from '../config/api';

const PAGE_SIZE = 10;

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStudentId, setResetStudentId] = useState(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/students');
      setStudents(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/api/students/${id}`);
        setStudents(students.filter(student => student._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  const handleOpenResetModal = (studentId) => {
    setResetStudentId(studentId);
    setResetPassword('');
    setResetConfirm('');
    setResetError('');
    setResetSuccess('');
    setShowResetModal(true);
  };

  const handleCloseResetModal = () => {
    setShowResetModal(false);
    setResetStudentId(null);
    setResetPassword('');
    setResetConfirm('');
    setResetError('');
    setResetSuccess('');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    if (!resetPassword || resetPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }
    if (resetPassword !== resetConfirm) {
      setResetError('Passwords do not match.');
      return;
    }
    try {
      await api.put(
        `/api/students/${resetStudentId}`,
        { password: resetPassword }
      );
      setResetSuccess('Password reset successfully!');
      setTimeout(() => {
        handleCloseResetModal();
      }, 1200);
    } catch (err) {
      setResetError(err.response?.data?.error || 'Failed to reset password');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-sky-800 mb-6">Students</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search students..."
          className="w-full px-4 py-2 border border-sky-200 rounded-md shadow-sm focus:border-sky-400 focus:ring-sky-400 bg-white text-blue-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mobile View - Card Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
        {paginatedStudents.map((student) => (
          <div key={student._id} className="bg-white rounded-lg shadow-md p-4 border border-sky-100">
            <div className="font-bold text-lg text-blue-900 mb-2">{student.name}</div>
            <div className="text-sm text-gray-600">Email: {student.email}</div>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => handleOpenResetModal(student._id)}
                className="w-full bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg shadow hover:bg-yellow-200 transition"
              >
                Reset Password
              </button>
              <button
                onClick={() => handleDelete(student._id)}
                className="w-full bg-red-100 text-red-700 px-3 py-1 rounded-lg shadow hover:bg-red-200 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table Layout */}
      <div className="hidden md:block bg-white shadow-lg rounded-2xl overflow-x-auto border border-sky-100">
        <table className="min-w-full divide-y divide-sky-100">
          <thead className="bg-sky-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student, idx) => (
              <tr key={student._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50 hover:bg-blue-50 transition'}>
                <td className="px-6 py-4 whitespace-nowrap text-blue-900 font-medium">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-800">{student.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <button
                        onClick={() => handleOpenResetModal(student._id)}
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg shadow hover:bg-yellow-200 transition"
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg shadow hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <div className="text-xl font-bold text-sky-700 mb-2">Reset Student Password</div>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                className="w-full border border-sky-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={resetPassword}
                onChange={e => setResetPassword(e.target.value)}
                minLength={6}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border border-sky-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={resetConfirm}
                onChange={e => setResetConfirm(e.target.value)}
                minLength={6}
                required
              />
              {resetError && <div className="text-red-600 text-sm">{resetError}</div>}
              {resetSuccess && <div className="text-green-600 text-sm">{resetSuccess}</div>}
              <div className="flex gap-2 justify-center mt-2">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  onClick={handleCloseResetModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-sky-200 text-blue-900 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-medium text-blue-900">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-sky-200 text-blue-900 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default StudentList; 
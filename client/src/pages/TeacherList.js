import React, { useState, useEffect } from 'react';
import api from '../config/api';

const PAGE_SIZE = 10;

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeachers(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const fetchTeachers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/teachers?page=${page}&limit=${PAGE_SIZE}`);
      setTeachers(response.data.data || []);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching teachers');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/teachers/${id}`);
      setTeachers(teachers.filter(teacher => teacher._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting teacher');
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-sky-800">Teachers</h1>

      {/* Mobile View - Card Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="bg-white rounded-lg shadow-md p-4 border border-sky-100">
            <div className="font-bold text-lg text-blue-900 mb-2">{teacher.name}</div>
            <div className="text-sm text-gray-600">Age: {teacher.age}</div>
            <div className="text-sm text-gray-600">Email: {teacher.email}</div>
            <div className="text-sm text-gray-600">Contact: {teacher.extraDetails?.contact}</div>
            <div className="text-sm text-gray-600">Qualifications: {teacher.extraDetails?.qualifications}</div>
            <div className="mt-4">
              <button
                onClick={() => handleDelete(teacher._id)}
                className="w-full bg-red-100 text-red-700 px-3 py-1 rounded-lg shadow hover:bg-red-200 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table Layout */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-x-auto border border-sky-100">
        <table className="min-w-full divide-y divide-sky-100">
          <thead className="bg-sky-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Qualifications</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, idx) => (
              <tr key={teacher._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50 hover:bg-blue-50 transition'}>
                <td className="px-6 py-4 whitespace-nowrap text-blue-900 font-medium">{teacher.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-800">{teacher.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-800">{teacher.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-800">{teacher.extraDetails?.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-800">{teacher.extraDetails?.qualifications}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  <button
                    onClick={() => handleDelete(teacher._id)}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => fetchTeachers(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-sky-200 text-blue-900 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-medium text-blue-900">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => fetchTeachers(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-sky-200 text-blue-900 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherList; 
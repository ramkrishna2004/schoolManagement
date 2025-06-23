import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PAGE_SIZE = 10;

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
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
        await axios.delete(`http://localhost:5000/api/students/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStudents(students.filter(student => student._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete student');
      }
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sky-800">Students</h1>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search students..."
          className="w-full px-4 py-2 border border-sky-200 rounded-md shadow-sm focus:border-sky-400 focus:ring-sky-400 bg-white text-blue-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-sky-100">
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
                  <Link
                    to={`/students/${student._id}`}
                    className="bg-sky-100 text-sky-800 px-3 py-1 rounded-lg shadow hover:bg-sky-200 transition"
                  >
                    View
                  </Link>
                  {user.role === 'admin' && (
                    <>
                      <Link
                        to={`/students/${student._id}/edit`}
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg shadow hover:bg-yellow-200 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg shadow hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
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
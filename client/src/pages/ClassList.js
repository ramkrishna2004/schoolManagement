import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';


const PAGE_SIZE = 10;

function ClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchClasses();
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/classes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setClasses(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch classes');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await api.delete(`/api/classes/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setClasses(classes.filter(cls => cls._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete class');
      }
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedClasses = filteredClasses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil(filteredClasses.length / PAGE_SIZE);

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
        <h1 className="text-2xl font-bold text-sky-800">Classes</h1>
        {user.role === 'admin' && (
          <Link
            to="/classes/new"
            className="bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700 transition"
          >
            Add Class
          </Link>
        )}
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search classes..."
          className="w-full px-4 py-2 border border-sky-200 rounded-md shadow-sm focus:border-sky-400 focus:ring-sky-400 bg-white text-blue-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border-2 border-sky-200">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-sky-200">
            <thead className="bg-gradient-to-r from-sky-200 to-sky-100">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Name</th>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Section</th>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Teacher</th>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Students</th>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClasses.map((cls, idx) => (
                <tr key={cls._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50 hover:bg-sky-100 transition'}>
                  <td className="px-8 py-5 whitespace-nowrap text-blue-900 font-semibold text-base">{cls.name}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-blue-800 text-base">{cls.section}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-blue-800 text-base">{cls.teacher?.name || 'Not Assigned'}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-blue-800 text-base">{cls.students?.length || 0} students</td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-medium flex gap-3">
                    <Link
                      to={`/classes/${cls._id}`}
                      className="bg-sky-200 text-sky-900 px-4 py-2 rounded-xl shadow hover:bg-sky-300 font-semibold transition text-base"
                    >
                      View
                    </Link>
                    {user.role === 'admin' && (
                      <>
                        <Link
                          to={`/classes/${cls._id}/edit`}
                          className="bg-yellow-200 text-yellow-900 px-4 py-2 rounded-xl shadow hover:bg-yellow-300 font-semibold transition text-base"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(cls._id)}
                          className="bg-red-200 text-red-800 px-4 py-2 rounded-xl shadow hover:bg-red-300 font-semibold transition text-base"
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

export default ClassList; 
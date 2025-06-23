import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes', {
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await axios.delete(`http://localhost:5000/api/classes/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchClasses();
      } catch (err) {
        setError('Failed to delete class');
      }
    }
  };

  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Classes</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all classes in the system.
          </p>
        </div>
        {user.role === 'admin' && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/classes/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Class
            </Link>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-4">
        <input
          type="text"
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="mt-8 flex flex-col">
        <div className="shadow-2xl rounded-3xl border-2 border-sky-200 overflow-hidden">
          <table className="min-w-full divide-y divide-sky-200">
            <thead className="bg-gradient-to-r from-sky-200 to-sky-100">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Class Name</th>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Subject</th>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Teacher</th>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Students</th>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-6 text-center text-base text-gray-500">No classes found</td>
                </tr>
              ) : (
                filteredClasses.map((classItem, idx) => (
                  <tr key={classItem._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50 hover:bg-sky-100 transition'}>
                    <td className="px-8 py-5 whitespace-nowrap text-blue-900 font-semibold text-base">{classItem.className}</td>
                    <td className="px-8 py-5 whitespace-nowrap text-blue-800 text-base">{classItem.subjectName}</td>
                    <td className="px-8 py-5 whitespace-nowrap text-blue-700 text-base">{classItem.teacherId?.name || 'Not assigned'}</td>
                    <td className="px-8 py-5 whitespace-nowrap text-blue-700 text-base">{classItem.studentIds?.length || 0} students</td>
                    <td className="px-8 py-5 whitespace-nowrap text-base font-medium flex gap-3 justify-end">
                      <Link
                        to={`/classes/${classItem._id}`}
                        className="bg-sky-200 text-sky-900 px-4 py-2 rounded-xl shadow hover:bg-sky-300 font-semibold transition text-base"
                      >
                        View
                      </Link>
                      {user.role === 'admin' && (
                        <>
                          <Link
                            to={`/classes/${classItem._id}/edit`}
                            className="bg-yellow-200 text-yellow-900 px-4 py-2 rounded-xl shadow hover:bg-yellow-300 font-semibold transition text-base"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(classItem._id)}
                            className="bg-red-200 text-red-800 px-4 py-2 rounded-xl shadow hover:bg-red-300 font-semibold transition text-base"
                          >
                            Delete
                          </button>
                        </>
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
  );
}

export default Classes; 
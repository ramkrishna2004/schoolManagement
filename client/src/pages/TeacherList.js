import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PAGE_SIZE = 10;

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTeachers();
    setCurrentPage(1); // Reset to first page on data change
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teachers');
      setTeachers(response.data.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/teachers/${id}`);
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const paginatedTeachers = teachers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil(teachers.length / PAGE_SIZE);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-sky-800">Teachers</h1>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-sky-100">
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
            {paginatedTeachers.map((teacher, idx) => (
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

export default TeacherList; 
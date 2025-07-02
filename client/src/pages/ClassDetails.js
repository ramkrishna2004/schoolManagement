import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../contexts/AuthContext';


function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    fetchClassDetails();
    fetchAvailableStudents();
  }, [id]);

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/classes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setClassData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch class details. Please try again later.');
      console.error('Error fetching class details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const response = await api.get('/api/students', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAvailableStudents(response.data);
    } catch (err) {
      console.error('Error fetching available students:', err);
    }
  };

  const handleEnrollStudent = async () => {
    if (!selectedStudent) return;

    try {
      await api.post(
        `/api/classes/${id}/enroll`,
        { studentId: selectedStudent },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchClassDetails();
      setSelectedStudent('');
    } catch (err) {
      setError('Failed to enroll student. Please try again later.');
      console.error('Error enrolling student:', err);
    }
  };

  const handleUnenrollStudent = async (studentId) => {
    try {
      await api.post(
        `/api/classes/${id}/unenroll`,
        { studentId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchClassDetails();
    } catch (err) {
      setError('Failed to unenroll student. Please try again later.');
      console.error('Error unenrolling student:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }

    try {
      await api.delete(`/api/classes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/classes');
    } catch (err) {
      setError('Failed to delete class. Please try again later.');
      console.error('Error deleting class:', err);
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
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {classData.className}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Subject: {classData.subjectName}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Teacher: {classData.teacherId.name}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => navigate(`/classes/${id}/edit`)}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Class
          </button>
          <button
            onClick={handleDelete}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Class
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Enrolled Students
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex space-x-4 mb-4">
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="skyblue-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="" className="skyblue-option">Select a student to enroll</option>
                  {availableStudents
                    .filter(student => !classData.studentIds.includes(student._id))
                    .map(student => (
                      <option key={student._id} value={student._id} className="skyblue-option">
                        {student.name}
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleEnrollStudent}
                  disabled={!selectedStudent}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Enroll Student
                </button>
              </div>

              <div className="mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classData.studentIds.map(student => (
                      <tr key={student._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleUnenrollStudent(student._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Unenroll
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassDetails; 
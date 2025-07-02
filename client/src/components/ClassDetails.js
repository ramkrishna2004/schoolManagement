import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';


function ClassDetails() {
  const [classData, setClassData] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchClassDetails();
    fetchAvailableStudents();
  }, [id]);

  const fetchClassDetails = async () => {
    try {
      const response = await api.get(`/api/classes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setClassData(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch class details');
      setLoading(false);
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const response = await api.get('/api/students', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAvailableStudents(response.data.data);
    } catch (err) {
      setError('Failed to fetch available students');
    }
  };

  const handleAddStudent = async (studentId) => {
    try {
      await api.post(
        `/api/classes/${id}/students`,
        { studentId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchClassDetails();
    } catch (err) {
      setError('Failed to add student to class');
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      await api.delete(
        `/api/classes/${id}/students/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchClassDetails();
    } catch (err) {
      setError('Failed to remove student from class');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
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
          {(user.role === 'admin' || user.role === 'teacher') && (
            <>
              <button
                onClick={() => navigate(`/classes/${id}/edit`)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Edit Class
              </button>
            </>
          )}
        </div>
      </div>

      {/* Student Management Section */}
      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Enrolled Students
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage student enrollment for this class
            </p>
          </div>

          {/* Add Student Section */}
          {(user.role === 'admin' || user.role === 'teacher') && (
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex items-center space-x-4">
                <select
                  className="skyblue-select"
                  onChange={(e) => handleAddStudent(e.target.value)}
                  value=""
                >
                  <option value="" className="skyblue-option">Add a student...</option>
                  {availableStudents
                    .filter(
                      (student) =>
                        !classData.studentIds.some(
                          (enrolled) => enrolled._id === student._id
                        )
                    )
                    .map((student) => (
                      <option key={student._id} value={student._id} className="skyblue-option">
                        {student.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          {/* Student List */}
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {classData.studentIds.map((student) => (
                <li key={student._id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                    {(user.role === 'admin' || user.role === 'teacher') && (
                      <button
                        onClick={() => handleRemoveStudent(student._id)}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassDetails; 
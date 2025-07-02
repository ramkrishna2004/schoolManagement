import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import { Assignment } from '@mui/icons-material';

function StudentAttendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'student' && user?.roleDetails?._id) {
      fetchAttendance(user.roleDetails._id);
        } else {
      setLoading(false);
      setError('You must be a student to view attendance.');
    }
  }, [user]);

  const fetchAttendance = async (studentId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/attendance/student/${studentId}`);
      setAttendance(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-sky-50 py-8 px-2 sm:px-6 lg:px-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-700 flex items-center gap-2">
          <Assignment className="text-sky-400" /> My Attendance
        </h1>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <table className="w-full text-left min-w-[400px]">
          <thead>
            <tr className="bg-sky-100 text-sky-900">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(r => (
              <tr key={r._id} className="border-b hover:bg-sky-50 transition">
                <td className="py-2 px-4">{new Date(r.date).toLocaleDateString()}</td>
                <td className="py-2 px-4">{typeof r.class === 'object' ? r.class.className : r.class}</td>
                <td className="py-2 px-4">
                  <span className={
                    r.status === 'Present'
                      ? 'text-green-600 font-semibold'
                      : r.status === 'Absent'
                        ? 'text-red-500 font-semibold'
                        : 'text-yellow-600 font-semibold'
                  }>
                    {r.status}
                  </span>
                </td>
                <td className="py-2 px-4">{r.remarks}</td>
              </tr>
            ))}
            {attendance.length === 0 && !error && (
              <tr>
                <td colSpan={4} className="text-center text-sky-400 py-6">No attendance records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentAttendance; 
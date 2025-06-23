import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Assignment } from '@mui/icons-material';

function StudentAttendance({ studentId }) {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    axios.get(`/api/attendance/student/${studentId}`)
      .then(res => setRecords(res.data.data || []))
      .catch(err => {
        if (err.response && err.response.status === 403) {
          setError('You are not authorized to view your attendance. Please contact your administrator.');
        } else if (err.response && err.response.status === 404) {
          setError('Attendance not found.');
        } else {
          setError('An unexpected error occurred while fetching attendance.');
        }
      });
  }, [studentId]);
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
            {records.map(r => (
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
            {records.length === 0 && !error && (
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
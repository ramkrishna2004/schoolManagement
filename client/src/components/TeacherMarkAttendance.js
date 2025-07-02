import React, { useEffect, useState } from 'react';
import { Assignment, CheckCircle } from '@mui/icons-material';
import api from '../config/api';

const STATUS_OPTIONS = [
  { value: 'Present', color: 'bg-green-100 text-green-700', border: 'border-green-400' },
  { value: 'Absent', color: 'bg-red-100 text-red-700', border: 'border-red-400' },
  { value: 'Leave', color: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-400' }
];

function TeacherMarkAttendance({ teacherId }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [classId, setClassId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [attendance, setAttendance] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');


  useEffect(() => {
    api.get('/api/classes', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setClasses(res.data.data));
  }, [teacherId]);

  useEffect(() => {
    if (classId) {
      api.get(`/api/classes/${classId}/students`).then(res => {
        setStudents(res.data);
        setAttendance(res.data.map(s => ({
          studentId: s._id,
          status: 'Present',
          time: new Date().toLocaleTimeString(),
          remarks: ''
        })));
      }).catch(err => {
        if (err.response && err.response.status === 403) {
          setStudents([]);
          setAttendance([]);
          setError('You are not authorized to view students for this class.');
        } else if (err.response && err.response.status === 404) {
          setStudents([]);
          setAttendance([]);
          setError('Class or students not found.');
        } else {
          setStudents([]);
          setAttendance([]);
          setError('An unexpected error occurred while fetching students.');
        }
      });
    }
  }, [classId]);

  const handleStatusChange = (idx, status) => {
    setAttendance(attendance.map((a, i) => i === idx ? { ...a, status } : a));
  };

  const handleRemarkChange = (idx, value) => {
    setAttendance(attendance.map((a, i) => i === idx ? { ...a, remarks: value } : a));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/api/attendance/mark', {
        classId, date, attendanceList: attendance, markedBy: teacherId
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setError('');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const msg = error.response.data.message || "";
        if (msg.toLowerCase().includes("holiday")) {
          setModalMsg("You cannot mark attendance on a holiday or Sunday.");
          setShowModal(true);
          setError("");
        } else {
          setError(msg || "An unexpected error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 py-8 px-2 sm:px-6 lg:px-12">
      {/* Modal for holiday/Sunday error */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <div className="text-xl font-bold text-red-600 mb-2">Attendance Not Allowed</div>
            <div className="text-gray-700 mb-4">{modalMsg}</div>
            <button
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg transition"
              onClick={() => setShowModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-700 flex items-center gap-2">
          <Assignment className="text-sky-400" /> Mark Attendance
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <label className="flex-1">
            <span className="block text-sky-900 font-semibold mb-1">Class</span>
            <select
              value={classId}
              onChange={e => setClassId(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            >
              <option value="">Select</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
            </select>
          </label>
          <label className="flex-1">
            <span className="block text-sky-900 font-semibold mb-1">Date</span>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[400px]">
            <thead>
              <tr className="bg-sky-100 text-sky-900">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={s._id} className="border-b hover:bg-sky-50 transition">
                  <td className="py-2 px-4">{s.name}</td>
                  <td className="py-2 px-4">
                    <div className="flex gap-2">
                      {STATUS_OPTIONS.map(opt => (
                        <button
                          type="button"
                          key={opt.value}
                          className={`px-3 py-1 rounded-lg border transition font-semibold
                            ${attendance[idx]?.status === opt.value
                              ? `${opt.color} ${opt.border} border-2`
                              : 'bg-sky-100 text-sky-700 border-sky-200 border'
                            }
                          `}
                          onClick={() => handleStatusChange(idx, opt.value)}
                        >
                          {opt.value}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      value={attendance[idx]?.remarks}
                      onChange={e => handleRemarkChange(idx, e.target.value)}
                      className="border border-sky-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-sky-400 py-6">No students found for this class.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          <CheckCircle /> Submit Attendance
        </button>
        {success && (
          <div className="mt-4 text-green-600 flex items-center gap-2 justify-center">
            <CheckCircle /> Attendance marked successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
export default TeacherMarkAttendance; 
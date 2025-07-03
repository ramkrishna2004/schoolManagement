import React, { useState, useEffect } from 'react';
import api from '../config/api';
import AnimatedInput from './AnimatedInput';


function ScheduleForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    classId: '',
    teacherId: '',
    subject: '',
    dayOfWeek: 'Monday',
    startTime: '',
    endTime: '',
    room: ''
  });
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClassesAndTeachers();
    if (initialData) {
      setFormData({
        classId: initialData.classId._id,
        teacherId: initialData.teacherId._id,
        subject: initialData.subject || '',
        dayOfWeek: initialData.dayOfWeek,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        room: initialData.room
      });
    }
  }, [initialData]);

  const fetchClassesAndTeachers = async () => {
    try {
      const [classesResponse, teachersResponse] = await Promise.all([
        api.get('/api/classes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }),
        api.get('/api/teachers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      setClasses(classesResponse.data.data);
      setTeachers(teachersResponse.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch classes and teachers');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Check for conflicts before submitting
      const conflictsResponse = await api.post(
        '/api/schedules/check-conflicts',
        {
          ...formData,
          scheduleId: initialData?._id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const { teacherConflicts, roomConflicts } = conflictsResponse.data.data;

      if (teacherConflicts.length > 0 || roomConflicts.length > 0) {
        let conflictMessage = 'Schedule conflicts detected:\n';
        if (teacherConflicts.length > 0) {
          conflictMessage += '\nTeacher conflicts:\n';
          teacherConflicts.forEach(conflict => {
            conflictMessage += `- ${conflict.classId.className} (${conflict.startTime}-${conflict.endTime})\n`;
          });
        }
        if (roomConflicts.length > 0) {
          conflictMessage += '\nRoom conflicts:\n';
          roomConflicts.forEach(conflict => {
            conflictMessage += `- ${conflict.classId.className} (${conflict.startTime}-${conflict.endTime})\n`;
          });
        }
        setError(conflictMessage);
          return;
      }

      if (initialData) {
        await onSubmit(initialData._id, formData);
      } else {
        await onSubmit(formData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save schedule');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {initialData ? 'Edit Schedule' : 'Create New Schedule'}
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Fill in the details to {initialData ? 'update' : 'create'} a schedule.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="classId" className="block text-sm font-medium text-gray-700">Class</label>
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md skyblue-select"
              >
                <option value="" className="skyblue-option">Select a class</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id} className="skyblue-option">
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-3">
              <AnimatedInput
                type="text"
                name="subject"
                id="subject"
                label="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Enter subject"
              />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">Teacher</label>
              <select
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md skyblue-select"
              >
                <option value="" className="skyblue-option">Select a teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id} className="skyblue-option">
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">Day</label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md skyblue-select"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <option key={day} value={day} className="skyblue-option">
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <AnimatedInput
                type="time"
                name="startTime"
                id="startTime"
                label="Start Time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <AnimatedInput
                type="time"
                name="endTime"
                id="endTime"
                label="End Time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <AnimatedInput
                type="text"
                name="room"
                id="room"
                label="Room"
                value={formData.room}
                onChange={handleChange}
                required
                placeholder="Enter room"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-lg shadow hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-400 rounded-lg shadow hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {initialData ? 'Update Schedule' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScheduleForm; 
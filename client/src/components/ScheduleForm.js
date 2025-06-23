import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        axios.get('http://localhost:5000/api/classes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }),
        axios.get('http://localhost:5000/api/teachers', {
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
      const conflictsResponse = await axios.post(
        'http://localhost:5000/api/schedules/check-conflicts',
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
              <label htmlFor="classId" className="block text-sm font-medium text-gray-700">
                Class
              </label>
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
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter subject"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">
                Teacher
              </label>
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
              <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">
                Day
              </label>
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
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                id="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                id="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="room" className="block text-sm font-medium text-gray-700">
                Room
              </label>
              <input
                type="text"
                name="room"
                id="room"
                value={formData.room}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter room number"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {initialData ? 'Update' : 'Create'} Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScheduleForm; 
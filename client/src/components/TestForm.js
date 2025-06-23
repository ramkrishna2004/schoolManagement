import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TestForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    testTitle: '',
    type: 'Unit Test',
    subjectName: '',
    classId: '',
    totalMarks: '',
    passingMarks: '',
    duration: '',
    scheduledDate: '',
    startTime: '',
    endTime: ''
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClasses();
    if (initialData) {
      setFormData({
        testTitle: initialData.title || '',
        type: initialData.type || 'Unit Test',
        subjectName: initialData.subject || '',
        classId: initialData.classId?._id || '',
        totalMarks: initialData.totalMarks || '',
        passingMarks: initialData.passingMarks || '',
        duration: initialData.duration || '',
        scheduledDate: initialData.scheduledDate ? new Date(initialData.scheduledDate).toISOString().split('T')[0] : '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
      });
    }
  }, [initialData]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!formData.testTitle || !formData.type || !formData.subjectName || 
          !formData.classId || !formData.totalMarks || !formData.passingMarks || 
          !formData.duration || !formData.scheduledDate || !formData.startTime || 
          !formData.endTime) {
        setError('Please fill in all required fields');
        return;
      }

      await onSubmit(formData);
    } catch (err) {
      console.error('Test submission error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to save test. Please try again.'
      );
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
          {initialData ? 'Edit Test' : 'Create New Test'}
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Fill in the details to {initialData ? 'update' : 'create'} a test.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="testTitle" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="testTitle"
                id="testTitle"
                value={formData.testTitle}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter test title"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md skyblue-select"
              >
                <option value="Unit Test" className="skyblue-option">Unit Test</option>
                <option value="Mid Term" className="skyblue-option">Mid Term</option>
                <option value="Final" className="skyblue-option">Final</option>
                <option value="Quiz" className="skyblue-option">Quiz</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subjectName"
                id="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter subject name"
              />
            </div>

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

            <div className="sm:col-span-2">
              <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700">
                Total Marks
              </label>
              <input
                type="number"
                name="totalMarks"
                id="totalMarks"
                value={formData.totalMarks}
                onChange={handleChange}
                required
                min="0"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="passingMarks" className="block text-sm font-medium text-gray-700">
                Passing Marks
              </label>
              <input
                type="number"
                name="passingMarks"
                id="passingMarks"
                value={formData.passingMarks}
                onChange={handleChange}
                required
                min="0"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                id="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="0"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
                Scheduled Date
              </label>
              <input
                type="date"
                name="scheduledDate"
                id="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div className="sm:col-span-3">
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

            <div className="sm:col-span-3">
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
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {initialData ? 'Update Test' : 'Create Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TestForm; 
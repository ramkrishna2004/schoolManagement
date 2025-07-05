import React, { useState, useEffect } from 'react';
import AnimatedInput from './AnimatedInput';
import api from '../config/api';


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
      const response = await api.get('/api/classes', {
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
              <AnimatedInput
                type="text"
                name="testTitle"
                id="testTitle"
                label="Title"
                value={formData.testTitle}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
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
              <AnimatedInput
                type="text"
                name="subjectName"
                id="subjectName"
                label="Subject"
                value={formData.subjectName}
                onChange={handleChange}
                required
              />
            </div>
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
            <div className="sm:col-span-2">
              <AnimatedInput
                type="number"
                name="totalMarks"
                id="totalMarks"
                label="Total Marks"
                value={formData.totalMarks}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="sm:col-span-2">
              <AnimatedInput
                type="number"
                name="passingMarks"
                id="passingMarks"
                label="Passing Marks"
                value={formData.passingMarks}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="sm:col-span-2">
              <AnimatedInput
                type="number"
                name="duration"
                id="duration"
                label="Duration (minutes)"
                value={formData.duration}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="sm:col-span-3">
              <AnimatedInput
                type="date"
                name="scheduledDate"
                id="scheduledDate"
                label="Scheduled Date"
                value={formData.scheduledDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sm:col-span-3">
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
            <div className="sm:col-span-3">
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
              {initialData ? 'Update Test' : 'Create Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TestForm; 
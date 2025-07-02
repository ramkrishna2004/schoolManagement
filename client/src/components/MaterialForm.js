import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { materialService } from '../services/materialService';

function MaterialForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    subjectName: '',
    category: 'other',
    topic: '',
    tags: '',
    isVisible: true,
    fileUrl: '',
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClasses();
    if (isEditing) {
      fetchMaterial();
    }
  }, [id]);

  const fetchClasses = async () => {
    try {
      console.log('Fetching classes...');
      const response = await materialService.getAvailableClasses();
      console.log('Classes API response:', response);
      setClasses(response.data);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to fetch classes');
    }
  };

  const fetchMaterial = async () => {
    try {
      setLoading(true);
      const response = await materialService.getMaterial(id);
      const material = response.data;
      setFormData({
        title: material.title,
        description: material.description || '',
        classId: material.classId._id,
        subjectName: material.subjectName || '',
        category: material.category,
        topic: material.topic || '',
        tags: material.tags ? material.tags.join(', ') : '',
        isVisible: material.isVisible,
        fileUrl: material.fileUrl || '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch material');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'classId') {
      // Auto-populate subject name when class is selected
      const selectedClass = classes.find(cls => cls._id === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        subjectName: selectedClass ? selectedClass.subjectName : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.fileUrl.trim()) {
      setError('Google Drive link is required');
      return;
    }
    if (!/^https:\/\/(drive|docs)\.google\.com\//.test(formData.fileUrl.trim())) {
      setError('Please enter a valid Google Drive link.');
      return;
    }
    if (!formData.classId) {
      setError('Please select a class');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        await materialService.updateMaterial(id, formData);
      } else {
        await materialService.createMaterial(formData);
      }

      navigate('/materials');
    } catch (err) {
      console.error('Error creating material:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      setError(err.response?.data?.error || 'Failed to save material');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableClasses = () => {
    console.log('User:', user);
    console.log('Classes:', classes);
    console.log('User role:', user?.role);
    console.log('User roleId:', user?.roleId);
    
    // Check if user exists
    if (!user) {
      console.log('User not found');
      return [];
    }
    
    // The backend already filters classes by role, so we can just return all classes
    // For teachers, the backend only returns their assigned classes
    // For admins, the backend returns classes they created
    console.log('Returning classes from backend:', classes);
    return classes;
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Edit Material' : 'Add New Material'}
        </h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter material title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter material description"
            />
          </div>

          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class *
            </label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 skyblue-select"
              required
            >
              <option value="" className="skyblue-option">Select a class</option>
              {getAvailableClasses().map((cls) => (
                <option key={cls._id} value={cls._id} className="skyblue-option">
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Name
            </label>
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter subject name"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 skyblue-select"
            >
              <option value="lecture" className="skyblue-option">Lecture</option>
              <option value="assignment" className="skyblue-option">Assignment</option>
              <option value="study_guide" className="skyblue-option">Study Guide</option>
              <option value="reference" className="skyblue-option">Reference</option>
              <option value="other" className="skyblue-option">Other</option>
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter topic (optional)"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter tags separated by commas"
            />
            <p className="mt-1 text-sm text-gray-500">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Google Drive Link */}
          <div className="mb-4">
            <label htmlFor="fileUrl" className="block text-gray-700 font-semibold mb-2">Google Drive Link</label>
              <input
              type="url"
              id="fileUrl"
              name="fileUrl"
              value={formData.fileUrl}
              onChange={handleInputChange}
              placeholder="Paste the public Google Drive link here"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              />
            <p className="text-xs text-gray-500 mt-1">Make sure the file is set to &quot;Anyone with the link can view&quot; in Google Drive.</p>
            </div>

          {/* Visibility */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Make this material visible to students
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/materials')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Material' : 'Upload Material')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MaterialForm; 
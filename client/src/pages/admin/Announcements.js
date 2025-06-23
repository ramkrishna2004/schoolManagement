import React, { useEffect, useState, useRef } from 'react';
import { announcementService } from '../../services/announcementService';
import AnnouncementList from '../../components/AnnouncementList';
import { useLocation } from 'react-router-dom';
import { 
  Add, 
  Edit, 
  Save, 
  Cancel, 
  NotificationsActiveRounded,
  Group,
  School,
  Public,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

const initialForm = {
  title: '',
  message: '',
  target: 'all',
  teacherIds: [],
  visibleFrom: '',
  visibleTo: '',
  isActive: true
};

function Announcements() {
  // const { user } = useAuth(); // Remove unused variable
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const location = useLocation();
  const formRef = useRef(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await announcementService.getAnnouncements({ includeInactive: true });
      setAnnouncements(data);
    } catch (err) {
      setError('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    if (location.state && location.state.openForm && formRef.current) {
      setShowForm(true);
      setTimeout(() => {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Clean up form data
      const data = {
        ...form,
        visibleFrom: form.visibleFrom ? form.visibleFrom : null,
        visibleTo: form.visibleTo ? form.visibleTo : null,
        teacherIds:
          form.target === 'teacher_specific'
            ? form.teacherIds.filter((id) => id && id.length === 24)
            : [],
      };
      if (editingId) {
        await announcementService.updateAnnouncement(editingId, data);
      } else {
        await announcementService.createAnnouncement(data);
      }
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      fetchAnnouncements();
    } catch (err) {
      setError('Failed to save announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (a) => {
    setForm({
      title: a.title,
      message: a.message,
      target: a.target,
      teacherIds: a.teacherIds || [],
      visibleFrom: a.visibleFrom ? a.visibleFrom.slice(0, 10) : '',
      visibleTo: a.visibleTo ? a.visibleTo.slice(0, 10) : '',
      isActive: a.isActive
    });
    setEditingId(a._id);
    setShowForm(true);
    setTimeout(() => {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) return;
    setLoading(true);
    try {
      await announcementService.deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (err) {
      setError('Failed to delete announcement');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const targetOptions = [
    { value: 'all', label: 'All Users', icon: <Public />, color: 'from-yellow-400 to-yellow-500' },
    { value: 'students', label: 'Students Only', icon: <School />, color: 'from-sky-400 to-sky-500' },
    { value: 'teachers', label: 'Teachers Only', icon: <Group />, color: 'from-blue-400 to-blue-500' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg">
            <NotificationsActiveRounded className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Announcement Management</h1>
            <p className="text-gray-600">Create and manage announcements for your school community</p>
          </div>
        </div>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Add />
            Create New Announcement
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Form */}
      {showForm && (
        <div ref={formRef} className="mb-8">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Edit className="text-white" />
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? 'Edit Announcement' : 'Create New Announcement'}
                  </h2>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <Cancel />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Announcement Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  placeholder="Enter announcement title..."
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message Content *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter your announcement message..."
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Target Audience *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {targetOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        form.target === option.value
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="target"
                        value={option.value}
                        checked={form.target === option.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`p-2 rounded-full bg-gradient-to-r ${option.color} text-white mr-3`}>
                        {option.icon}
                      </div>
                      <span className="font-medium text-gray-700">{option.label}</span>
                      {form.target === option.value && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Visibility />
                      Visible From
                    </div>
                  </label>
                  <input
                    type="date"
                    name="visibleFrom"
                    value={form.visibleFrom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to show immediately</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <VisibilityOff />
                      Visible Until
                    </div>
                  </label>
                  <input
                    type="date"
                    name="visibleTo"
                    value={form.visibleTo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for no expiration</p>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-3 text-sm font-medium text-gray-700">
                  Make this announcement active immediately
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save />
                  )}
                  {editingId ? 'Update Announcement' : 'Create Announcement'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">All Announcements</h3>
          <p className="text-sm text-gray-600">Manage existing announcements</p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading announcements...</p>
            </div>
          ) : (
            <AnnouncementList 
              announcements={announcements} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              isAdmin={true} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Announcements; 
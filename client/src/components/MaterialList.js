import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { materialService } from '../services/materialService';
import {  formatDate } from '../utils/formatters';

function MaterialList() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    classId: ''
  });
  const [classes, setClasses] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchMaterials();
    if (user.role === 'admin' || user.role === 'teacher') {
      fetchClasses();
    }
  }, [filters, pagination.currentPage]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: 10
      };
      const response = await materialService.getMaterials(params);
      setMaterials(response.data);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await materialService.getAvailableClasses();
      setClasses(response.data);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await materialService.deleteMaterial(id);
        fetchMaterials();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete material');
      }
    }
  };

  const handleView = async (material) => {
    try {
      await materialService.logMaterialAccess(material._id, 'view');
    } catch (e) { /* ignore logging errors */ }
    window.open(material.fileUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = async (material) => {
    try {
      await materialService.logMaterialAccess(material._id, 'download');
    } catch (e) { /* ignore logging errors */ }
    window.open(material.fileUrl, '_blank', 'noopener,noreferrer');
  };

  const getCategoryColor = (category) => {
    const colors = {
      lecture: 'bg-blue-100 text-blue-800',
      assignment: 'bg-green-100 text-green-800',
      study_guide: 'bg-purple-100 text-purple-800',
      reference: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Materials</h1>
        {(user.role === 'admin' || user.role === 'teacher') && (
          <Link
            to="/materials/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Add New Material
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search materials..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="lecture">Lecture</option>
              <option value="assignment">Assignment</option>
              <option value="study_guide">Study Guide</option>
              <option value="reference">Reference</option>
              <option value="other">Other</option>
            </select>
          </div>
          {(user.role === 'admin' || user.role === 'teacher') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                value={filters.classId}
                onChange={(e) => handleFilterChange('classId', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Materials List */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-sky-100">
        <table className="min-w-full divide-y divide-sky-100">
          <thead className="bg-sky-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Uploaded</th>
              {(user.role === 'admin' || user.role === 'teacher') && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Downloads</th>
                </>
              )}
              <th className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 ? (
              <tr><td colSpan={user.role === 'admin' || user.role === 'teacher' ? 7 : 5} className="px-6 py-4 text-center text-gray-500">No materials found</td></tr>
            ) : (
              materials.map((material, idx) => (
                <tr key={material._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50 hover:bg-blue-50 transition'}>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-900 font-medium">{material.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${getCategoryColor(material.category)}`}>{material.category.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-800">{material.classId?.className || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-700">{formatDate(material.createdAt)}</td>
                  {(user.role === 'admin' || user.role === 'teacher') && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-800">{typeof material.totalViews === 'number' ? material.totalViews : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-800">{typeof material.totalDownloads === 'number' ? material.totalDownloads : '-'}</td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <button
                      onClick={() => handleView(material)}
                      className="bg-sky-100 text-sky-800 px-3 py-1 rounded-lg shadow hover:bg-sky-200 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(material)}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-lg shadow hover:bg-green-200 transition"
                    >
                      Download
                    </button>
                    {(user.role === 'admin' || user.role === 'teacher') && (
                      <button
                        onClick={() => handleDelete(material._id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg shadow hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.total} total)
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaterialList; 
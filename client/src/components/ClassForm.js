import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnimatedInput from './AnimatedInput';
import api from '../config/api';


function ClassForm() {
  const [formData, setFormData] = useState({
    className: '',
    subjectName: '',
    teacherId: ''
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchTeachers();
    if (id) {
      fetchClass();
    }
  }, [id]);

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/api/teachers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTeachers(response.data.data);
    } catch (err) {
      setError('Failed to fetch teachers');
    }
  };

  const fetchClass = async () => {
    try {
      const response = await api.get(`/api/classes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFormData({
        className: response.data.data.className,
        subjectName: response.data.data.subjectName,
        teacherId: response.data.data.teacherId._id
      });
    } catch (err) {
      setError('Failed to fetch class details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await api.put(`/api/classes/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await api.post('/api/classes', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      navigate('/classes');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save class');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">{id ? 'Edit Class' : 'Create New Class'}</h2>
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      <AnimatedInput
        id="className"
        label="Class Name"
            value={formData.className}
            onChange={handleChange}
        name="className"
        autoComplete="off"
          />
      <AnimatedInput
        id="subjectName"
        label="Subject Name"
            value={formData.subjectName}
            onChange={handleChange}
        name="subjectName"
        autoComplete="off"
          />
      <div className="relative group my-6">
          <select
          id="teacherId"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            required
          className="w-full px-3 py-2 pt-5 bg-white border-2 border-gray-200 rounded-lg shadow-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-800 text-sm appearance-none"
          >
          <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
        <label htmlFor="teacherId" className="absolute left-3 top-3.5 text-gray-500 text-base pointer-events-none transition-all duration-200 transform origin-left peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-focus:bg-white peer-focus:px-1 peer-focus:shadow-lg">Teacher</label>
        </div>
      <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={() => navigate('/classes')}
          className="px-5 py-2 text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-lg shadow hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
          className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-400 rounded-lg shadow hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          >
            {loading ? 'Saving...' : id ? 'Update Class' : 'Create Class'}
          </button>
        </div>
      </form>
  );
}

export default ClassForm; 
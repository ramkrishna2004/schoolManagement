import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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
      const response = await axios.get('http://localhost:5000/api/teachers', {
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
      const response = await axios.get(`http://localhost:5000/api/classes/${id}`, {
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
        await axios.put(`http://localhost:5000/api/classes/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await axios.post('http://localhost:5000/api/classes', formData, {
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
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {id ? 'Edit Class' : 'Create New Class'}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Class Name
          </label>
          <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subject Name
          </label>
          <input
            type="text"
            name="subjectName"
            value={formData.subjectName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Teacher
          </label>
          <select
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 skyblue-select"
          >
            <option value="" className="skyblue-option">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id} className="skyblue-option">
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/classes')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : id ? 'Update Class' : 'Create Class'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClassForm; 
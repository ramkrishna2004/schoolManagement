import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedInput from '../components/AnimatedInput';

function AdminRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    extraDetails: {
      contact: '',
      department: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!formData.age || formData.age < 18) {
      setError('Admin must be at least 18 years old');
      return;
    }

    if (!formData.extraDetails.contact) {
      setError('Please add a contact number');
      return;
    }

    if (!formData.extraDetails.department) {
      setError('Please add a department');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        'admin',
        formData.age,
        formData.extraDetails
      );
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Admin Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <AnimatedInput
              id="name"
              name="name"
              label="Full Name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <AnimatedInput
              id="email"
              name="email"
              label="Email address"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <AnimatedInput
              id="password"
              name="password"
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <AnimatedInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <AnimatedInput
              id="age"
              name="age"
              label="Age"
              type="number"
              min="18"
              required
              value={formData.age}
              onChange={handleChange}
            />
            <AnimatedInput
              id="contact"
              name="extraDetails.contact"
              label="Contact Number"
              type="tel"
              required
              value={formData.extraDetails.contact}
              onChange={handleChange}
            />
            <AnimatedInput
              id="department"
              name="extraDetails.department"
              label="Department"
              type="text"
              required
              value={formData.extraDetails.department}
              onChange={handleChange}
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2 text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-lg shadow hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-400 rounded-lg shadow hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister; 
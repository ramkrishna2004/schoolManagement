import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedInput from '../components/AnimatedInput';

function Register() {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    age: '',
    rollno: '',
    extraDetails: {
      parentContact: '',
      address: '',
      contact: '',
      qualifications: ''
    }
  });
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  if (loading) return null;
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
          <p className="text-gray-700">Only admins can access the registration page.</p>
        </div>
      </div>
    );
  }

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

    if (formData.role === 'student') {
      if (!formData.age || formData.age < 5) {
        setError('Student must be at least 5 years old');
        return;
      }
      if (!formData.rollno) {
        setError('Roll number is required');
        return;
      }
      if (!formData.extraDetails.parentContact) {
        setError('Please add parent contact');
        return;
      }
      if (!formData.extraDetails.address) {
        setError('Please add an address');
        return;
      }
    } else if (formData.role === 'teacher') {
      if (!formData.age || formData.age < 18) {
        setError('Teacher must be at least 18 years old');
        return;
      }
      if (!formData.extraDetails.contact) {
        setError('Please add a contact number');
        return;
      }
      if (!formData.extraDetails.qualifications) {
        setError('Please add qualifications');
        return;
      }
    }

    setFormLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.age,
        formData.extraDetails,
        formData.rollno
      );
      const from = location.state?.from || '/';
      navigate(from);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to register. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
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
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm skyblue-select"
              >
                <option value="student" className="skyblue-option">Student</option>
                <option value="teacher" className="skyblue-option">Teacher</option>
              </select>
            </div>
            <AnimatedInput
              id="age"
              name="age"
              label="Age"
              type="number"
              required
              value={formData.age}
              onChange={handleChange}
            />
            {formData.role === 'student' && (
              <>
                <AnimatedInput
                  id="rollno"
                  name="rollno"
                  label="Roll Number"
                  type="text"
                  required
                  value={formData.rollno}
                  onChange={handleChange}
                />
                <AnimatedInput
                  id="parentContact"
                  name="extraDetails.parentContact"
                  label="Parent Contact"
                  type="text"
                  required
                  value={formData.extraDetails.parentContact}
                  onChange={handleChange}
                />
                <AnimatedInput
                  id="address"
                  name="extraDetails.address"
                  label="Address"
                  type="text"
                  required
                  value={formData.extraDetails.address}
                  onChange={handleChange}
                />
              </>
            )}
            {formData.role === 'teacher' && (
              <>
                <AnimatedInput
                  id="contact"
                  name="extraDetails.contact"
                  label="Contact"
                  type="text"
                  required
                  value={formData.extraDetails.contact}
                  onChange={handleChange}
                />
                <AnimatedInput
                  id="qualifications"
                  name="extraDetails.qualifications"
                  label="Qualifications"
                  type="text"
                  required
                  value={formData.extraDetails.qualifications}
                  onChange={handleChange}
                />
              </>
            )}
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
                disabled={formLoading}
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

export default Register; 
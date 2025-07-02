import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedInput from './AnimatedInput';

function UserForm({ userType, initialData, onSubmit, isEdit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    organizationName: '',
    extraDetails: {
      contact: '',
      qualifications: '',
      address: '',
      parentContact: ''
    }
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: '',
        confirmPassword: ''
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = 'Name is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!isEdit && !formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.age) {
      errors.age = 'Age is required';
    } else if (userType === 'teacher' && formData.age < 18) {
      errors.age = 'Teacher must be at least 18 years old';
    } else if (userType === 'student' && formData.age < 5) {
      errors.age = 'Student must be at least 5 years old';
    }
    if (userType === 'admin' && !formData.organizationName) {
      errors.organizationName = 'Organization name is required';
    }
    if (userType === 'teacher') {
      if (!formData.extraDetails.contact) {
        errors['extraDetails.contact'] = 'Contact is required';
      }
      if (!formData.extraDetails.qualifications) {
        errors['extraDetails.qualifications'] = 'Qualifications are required';
      }
    }
    if (userType === 'student') {
      if (!formData.extraDetails.address) {
        errors['extraDetails.address'] = 'Address is required';
      }
      if (!formData.extraDetails.parentContact) {
        errors['extraDetails.parentContact'] = 'Parent contact is required';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = {
        ...formData,
        extraDetails: userType === 'teacher' ? {
          contact: formData.extraDetails.contact,
          qualifications: formData.extraDetails.qualifications
        } : userType === 'student' ? {
          address: formData.extraDetails.address,
          parentContact: formData.extraDetails.parentContact
        } : undefined
      };
      delete userData.confirmPassword;
      if (isEdit && !userData.password) {
        delete userData.password;
      }
      await onSubmit(userData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('extraDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        extraDetails: {
          ...prev.extraDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">{isEdit ? 'Edit User' : 'Create User'}</h2>
      <AnimatedInput
          id="name"
        label={userType === 'admin' ? 'Admin Name' : 'Name'}
          value={formData.name}
          onChange={handleChange}
        name="name"
        autoComplete="off"
        />
      {formErrors.name && <p className="text-xs text-red-600 -mt-4 mb-2">{formErrors.name}</p>}

      <AnimatedInput
          id="email"
        label="Email"
          value={formData.email}
          onChange={handleChange}
        name="email"
        type="email"
        autoComplete="off"
        />
      {formErrors.email && <p className="text-xs text-red-600 -mt-4 mb-2">{formErrors.email}</p>}

      <div className="relative">
        <AnimatedInput
          id="password"
          label={isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
          value={formData.password}
          onChange={handleChange}
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-7 text-xs text-indigo-600 hover:underline focus:outline-none"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {formErrors.password && <p className="text-xs text-red-600 -mt-4 mb-2">{formErrors.password}</p>}

      <div className="relative">
        <AnimatedInput
          id="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-7 text-xs text-indigo-600 hover:underline focus:outline-none"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {formErrors.confirmPassword && <p className="text-xs text-red-600 -mt-4 mb-2">{formErrors.confirmPassword}</p>}

      <AnimatedInput
          id="age"
        label="Age"
          value={formData.age}
          onChange={handleChange}
        name="age"
        type="number"
        autoComplete="off"
        />
      {formErrors.age && <p className="text-xs text-red-600 -mt-4 mb-2">{formErrors.age}</p>}

      {userType === 'admin' && (
        <>
          <AnimatedInput
            id="organizationName"
            label="Organization Name"
            value={formData.organizationName}
            onChange={handleChange}
            name="organizationName"
            autoComplete="off"
          />
          {formErrors.organizationName && <p className="text-xs text-red-600 -mt-4 mb-2">{formErrors.organizationName}</p>}
        </>
      )}

      {userType === 'teacher' && (
        <>
          <AnimatedInput
              id="contact"
            label="Contact"
              value={formData.extraDetails.contact}
              onChange={handleChange}
            name="extraDetails.contact"
            autoComplete="off"
            />
          {formErrors['extraDetails.contact'] && <p className="text-xs text-red-600 -mt-4 mb-2">{formErrors['extraDetails.contact']}</p>}
          <AnimatedInput
              id="qualifications"
            label="Qualifications"
              value={formData.extraDetails.qualifications}
              onChange={handleChange}
            name="extraDetails.qualifications"
            autoComplete="off"
            />
          {formErrors['extraDetails.qualifications'] && <p className="text-xs text-red-600 -mt-4 mb-2">{formErrors['extraDetails.qualifications']}</p>}
        </>
      )}

      {userType === 'student' && (
        <>
          <AnimatedInput
              id="address"
            label="Address"
              value={formData.extraDetails.address}
              onChange={handleChange}
            name="extraDetails.address"
            autoComplete="off"
            />
          {formErrors['extraDetails.address'] && <p className="text-xs text-red-600 -mt-4 mb-2">{formErrors['extraDetails.address']}</p>}
          <AnimatedInput
              id="parentContact"
            label="Parent Contact"
              value={formData.extraDetails.parentContact}
              onChange={handleChange}
            name="extraDetails.parentContact"
            autoComplete="off"
            />
          {formErrors['extraDetails.parentContact'] && <p className="text-xs text-red-600 -mt-4 mb-2">{formErrors['extraDetails.parentContact']}</p>}
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
          className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-400 rounded-lg shadow hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {isEdit ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

export default UserForm; 
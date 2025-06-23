import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {userType === 'admin' ? 'Admin Name' : 'Name'}
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            formErrors.name ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            formErrors.email ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {formErrors.email && (
          <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            formErrors.password ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {formErrors.password && (
          <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {formErrors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
        )}
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          type="number"
          name="age"
          id="age"
          value={formData.age}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            formErrors.age ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {formErrors.age && (
          <p className="mt-1 text-sm text-red-600">{formErrors.age}</p>
        )}
      </div>

      {userType === 'admin' && (
        <div>
          <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
            Organization Name
          </label>
          <input
            type="text"
            name="organizationName"
            id="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              formErrors.organizationName ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {formErrors.organizationName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.organizationName}</p>
          )}
        </div>
      )}

      {userType === 'teacher' && (
        <>
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
              Contact
            </label>
            <input
              type="text"
              name="extraDetails.contact"
              id="contact"
              value={formData.extraDetails.contact}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                formErrors['extraDetails.contact'] ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors['extraDetails.contact'] && (
              <p className="mt-1 text-sm text-red-600">{formErrors['extraDetails.contact']}</p>
            )}
          </div>
          <div>
            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
              Qualifications
            </label>
            <input
              type="text"
              name="extraDetails.qualifications"
              id="qualifications"
              value={formData.extraDetails.qualifications}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                formErrors['extraDetails.qualifications'] ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors['extraDetails.qualifications'] && (
              <p className="mt-1 text-sm text-red-600">{formErrors['extraDetails.qualifications']}</p>
            )}
          </div>
        </>
      )}

      {userType === 'student' && (
        <>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="extraDetails.address"
              id="address"
              value={formData.extraDetails.address}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                formErrors['extraDetails.address'] ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors['extraDetails.address'] && (
              <p className="mt-1 text-sm text-red-600">{formErrors['extraDetails.address']}</p>
            )}
          </div>
          <div>
            <label htmlFor="parentContact" className="block text-sm font-medium text-gray-700">
              Parent Contact
            </label>
            <input
              type="text"
              name="extraDetails.parentContact"
              id="parentContact"
              value={formData.extraDetails.parentContact}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                formErrors['extraDetails.parentContact'] ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors['extraDetails.parentContact'] && (
              <p className="mt-1 text-sm text-red-600">{formErrors['extraDetails.parentContact']}</p>
            )}
          </div>
        </>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEdit ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

export default UserForm; 
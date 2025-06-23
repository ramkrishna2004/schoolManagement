import axios from 'axios';

export const materialService = {
  // Get all materials with filters
  getMaterials: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:5000/api/materials?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Get single material
  getMaterial: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:5000/api/materials/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Create new material
  createMaterial: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5000/api/materials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  },

  // Update material
  updateMaterial: async (id, data) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`http://localhost:5000/api/materials/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Delete material
  deleteMaterial: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`http://localhost:5000/api/materials/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Download material
  downloadMaterial: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:5000/api/materials/${id}/download`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  },

  // Get material analytics
  getMaterialAnalytics: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:5000/api/materials/${id}/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Get available classes for material upload
  getAvailableClasses: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/classes', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
}; 
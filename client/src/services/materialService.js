import api from '../config/api';


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
    const response = await api.get('/api/materials', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Get single material
  getMaterial: async (id) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/api/materials/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Create new material
  createMaterial: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await api.post('/api/materials', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  },

  // Update material
  updateMaterial: async (id, data) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/api/materials/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Delete material
  deleteMaterial: async (id) => {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/api/materials/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Download material
  downloadMaterial: async (id) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/api/materials/${id}/download`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'blob'
    });
    return response;
  },

  // Get material analytics
  getMaterialAnalytics: async (id) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/api/materials/${id}/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Get available classes for material upload
  getAvailableClasses: async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/classes', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Log material access (view/download)
  logMaterialAccess: async (id, accessType) => {
    const token = localStorage.getItem('token');
    await api.post(`/api/materials/${id}/access`, { accessType }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}; 
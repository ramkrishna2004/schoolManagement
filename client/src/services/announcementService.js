import api from '../config/api';

const API_URL = '/api/announcements';

export const announcementService = {
  getAnnouncements: async (params = {}) => {
    const token = localStorage.getItem('token');
    const response = await api.get(API_URL, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },
  getAnnouncement: async (id) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },
  createAnnouncement: async (data) => {
    const token = localStorage.getItem('token');
    const response = await api.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },
  updateAnnouncement: async (id, data) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },
  deleteAnnouncement: async (id) => {
    const token = localStorage.getItem('token');
    const response = await api.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
}; 
import api from '../config/api';

const API_URL = '/api/analytics';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const analyticsService = {
  getStudentAnalytics: async () => {
    const response = await api.get(`${API_URL}/student`, getAuthHeaders());
    return response.data.data;
  },
  getClassAnalytics: async (classId) => {
    const response = await api.get(`${API_URL}/class/${classId}`, getAuthHeaders());
    return response.data.data;
  },
  getAllAnalytics: async ({ startDate, endDate }) => {
    console.log('API call params:', { startDate, endDate });
    const response = await api.get('/api/analytics/all', {
      params: { startDate, endDate }
    });
    return response.data.data;
  },
  getStudentAnalyticsById: async (studentId) => {
    const response = await api.get(`${API_URL}/student/${studentId}`, getAuthHeaders());
    return response.data.data;
  },
}; 
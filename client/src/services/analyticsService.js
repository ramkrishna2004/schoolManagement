import axios from 'axios';

const API_URL = '/api/analytics';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const analyticsService = {
  getStudentAnalytics: async () => {
    const response = await axios.get(`${API_URL}/student`, getAuthHeaders());
    return response.data.data;
  },
  getClassAnalytics: async (classId) => {
    const response = await axios.get(`${API_URL}/class/${classId}`, getAuthHeaders());
    return response.data.data;
  },
  getAllAnalytics: async () => {
    const response = await axios.get(`${API_URL}/all`, getAuthHeaders());
    return response.data.data;
  },
  getStudentAnalyticsById: async (studentId) => {
    const response = await axios.get(`${API_URL}/student/${studentId}`, getAuthHeaders());
    return response.data.data;
  },
}; 
import api from '../config/api';

const API_URL = '/api/diaries';

export const createDiary = async (data, token) => {
  const res = await api.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getDiaries = async (classId, date, page, token) => {
  const params = new URLSearchParams({
    classId: classId || '',
    page: page || 1
  });
  if (date) {
    params.append('date', date);
  }
  const res = await api.get(`${API_URL}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateDiary = async (id, data, token) => {
  const res = await api.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteDiary = async (id, token) => {
  const res = await api.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}; 
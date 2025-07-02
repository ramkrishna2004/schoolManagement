import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('AuthContext useEffect - Token from localStorage:', storedToken);
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      console.log('AuthContext useEffect - Axios Authorization header set:', api.defaults.headers.common['Authorization']);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (currentAuthToken) => {
    if (!currentAuthToken || !api.defaults.headers.common['Authorization']) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('api/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    try {
      const body = { password };
      if (identifier.includes('@')) {
        body.email = identifier;
      } else {
        body.rollno = identifier;
      }
      const response = await api.post('api/auth/login', body);
      if (response.data.success) {
        const { token: receivedToken, ...userData } = response.data.data;
        console.log('Login successful - Received Token:', receivedToken);
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
        console.log('Login successful - Axios Authorization header set:', api.defaults.headers.common['Authorization']);
        setUser(userData);
        return userData;
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.error || error.message || 'Login failed';
    }
  };

  const register = async (name, email, password, role, age, extraDetails, rollno) => {
    let endpoint;
    switch (role) {
      case 'admin':
        endpoint = 'api/auth/register/admin';
        break;
      case 'teacher':
        endpoint = 'api/auth/register/teacher';
        break;
      case 'student':
        endpoint = 'api/auth/register/student';
        break;
      default:
        throw new Error('Invalid role');
    }

    // Always send the Authorization header for teacher/student registration
    const headers = {};
    if (role !== 'admin') {
      const currentToken = token || localStorage.getItem('token');
      if (currentToken) {
        headers['Authorization'] = `Bearer ${currentToken}`;
      }
    }

    const body = { name, email, password, age, extraDetails };
    if (role === 'student' && rollno) {
      body.rollno = rollno;
    }

    const response = await api.post(endpoint, body, { headers });

    const { token: receivedToken, ...userData } = response.data.data;
    if (!user) {
      console.log('Registration successful - Received Token:', receivedToken);
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      console.log('Registration successful - Axios Authorization header set:', api.defaults.headers.common['Authorization']);
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ScoreList from '../components/ScoreList';
import api from '../config/api';


function ScoreListPage() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const response = await api.get('/api/scores', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setScores(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch scores');
      setLoading(false);
    }
  };

  const filteredScores = scores.filter(score =>
    (score.studentId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (score.testId?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (score.classId?.className || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ScoreList scores={filteredScores} isTeacher={user.role === 'teacher'} />
    </div>
  );
}

export default ScoreListPage; 
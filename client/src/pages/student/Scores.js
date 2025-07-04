import React, { useState, useEffect } from 'react';
import ScoreList from '../../components/ScoreList';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';


const Scores = () => {
  const [allScores, setAllScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const scoreRes = await api.get('/api/scores');
        setAllScores(scoreRes.data.data || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Test Scores</h1>
          <p className="mt-2 text-sm text-gray-600">
            View your test scores and performance
          </p>
        </div>
      </div>
      
      {error && (
         <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
         </div>
      )}

      <ScoreList
        scores={allScores}
        isTeacher={false}
      />
    </div>
  );
};

export default Scores; 
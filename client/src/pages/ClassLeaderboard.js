import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../config/api';
import Leaderboard from '../components/Leaderboard';

const ClassLeaderboard = () => {
  const { classId } = useParams();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classInfo, setClassInfo] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [classId]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/scores/classes/${classId}/leaderboard`);
      setScores(response.data.data);
      setClassInfo(response.data.data[0]?.classId);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {classInfo ? `${classInfo.className} Leaderboard` : 'Class Leaderboard'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          View class rankings and student performance
        </p>
      </div>

      <Leaderboard scores={scores} />
    </div>
  );
};

export default ClassLeaderboard; 
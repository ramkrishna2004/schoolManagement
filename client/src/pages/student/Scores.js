import React, { useState, useEffect } from 'react';
import ScoreList from '../../components/ScoreList';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';


const Scores = () => {
  const [allScores, setAllScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [classRes, scoreRes] = await Promise.all([
          api.get('/api/students/enrolled-classes'),
          api.get('/api/scores')
        ]);
        
        const fetchedClasses = classRes.data.data || [];
        setClasses(fetchedClasses);
        setAllScores(scoreRes.data.data || []);

        if (fetchedClasses.length > 0) {
          setSelectedClass(fetchedClasses[0]._id);
        }
        
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

  useEffect(() => {
    if (selectedClass) {
      setFilteredScores(allScores.filter(score => score.classId?._id === selectedClass));
    } else {
      setFilteredScores(allScores);
    }
  }, [selectedClass, allScores]);

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
        <div className="mt-4 md:mt-0">
          <label className="font-semibold text-gray-700 mr-2">Filter by Class:</label>
          <select 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
            className="border rounded p-2"
          >
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.className}</option>
            ))}
          </select>
        </div>
      </div>
      
      {error && (
         <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
         </div>
      )}

      <ScoreList
        scores={filteredScores}
        isTeacher={false}
      />
    </div>
  );
};

export default Scores; 
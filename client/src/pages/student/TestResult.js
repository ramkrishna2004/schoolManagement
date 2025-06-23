import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const TestResult = () => {
  const { id: testId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [test, setTest] = useState(null);
  const [score, setScore] = useState(null);
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    fetchResult();
    // eslint-disable-next-line
  }, [testId]);

  const fetchResult = async () => {
    setLoading(true);
    try {
      // Fetch test info
      const testRes = await axios.get(`http://localhost:5000/api/tests/${testId}`);
      setTest(testRes.data.data);
      // Fetch student's score for this test
      const scoreRes = await axios.get(`http://localhost:5000/api/scores?testId=${testId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setScore(scoreRes.data.data[0]);
      // Fetch student's attempt for this test
      const attemptRes = await axios.get(`http://localhost:5000/api/tests/${testId}/attempts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAttempt(attemptRes.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch result');
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
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!test || !score || !attempt) {
    return <div className="text-center text-gray-500 mt-8">Result not available.</div>;
  }

  // Calculate time taken
  const start = attempt.startTime ? new Date(attempt.startTime) : null;
  const end = attempt.endTime ? new Date(attempt.endTime) : null;
  const totalTimeSec = start && end ? Math.floor((end - start) / 1000) : 0;
  const totalTimeMin = Math.floor(totalTimeSec / 60);
  const totalTimeRemSec = totalTimeSec % 60;
  const totalQuestions = attempt.submittedAnswers ? Object.keys(attempt.submittedAnswers).length : 0;
  const avgTimePerQ = totalQuestions > 0 ? Math.round(totalTimeSec / totalQuestions) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-2">Test Result</h1>
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-900">{test.title}</div>
          <div className="text-sm text-gray-500">{test.subject} &bull; {test.classId?.className}</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="bg-indigo-50 rounded-lg p-4 flex flex-col items-center">
            <span className="text-sm text-gray-500">Total Marks</span>
            <span className="text-2xl font-bold text-indigo-800">{score.totalMarks}</span>
          </div>
          <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center">
            <span className="text-sm text-gray-500">Obtained Marks</span>
            <span className="text-2xl font-bold text-green-800">{score.obtainedMarks}</span>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 flex flex-col items-center">
            <span className="text-sm text-gray-500">Percentage</span>
            <span className="text-2xl font-bold text-yellow-700">{score.score}%</span>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
            <span className="text-sm text-gray-500">Total Time Taken</span>
            <span className="text-2xl font-bold text-blue-800">{totalTimeMin}m {totalTimeRemSec}s</span>
          </div>
          <div className="bg-pink-50 rounded-lg p-4 flex flex-col items-center">
            <span className="text-sm text-gray-500">Average Time per Question</span>
            <span className="text-2xl font-bold text-pink-700">{avgTimePerQ}s</span>
          </div>
        </div>
        <div className="mt-8 flex justify-between">
          <Link to="/student/tests" className="text-indigo-600 hover:underline">Back to Tests</Link>
        </div>
      </div>
    </div>
  );
};

export default TestResult; 
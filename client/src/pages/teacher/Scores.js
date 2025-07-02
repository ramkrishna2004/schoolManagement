import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScoreList from '../../components/ScoreList';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';


const Scores = () => {
  const [scores, setScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [classes, setClasses] = useState([]);
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterScores();
  }, [scores, selectedClass, selectedTest, selectedStudent]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [scoresRes, classesRes, testsRes, studentsRes] = await Promise.all([
        api.get('/api/scores'),
        api.get('/api/classes'),
        api.get('/api/tests'),
        api.get('/api/students')
      ]);
      setScores(scoresRes.data.data);
      setClasses(classesRes.data.data);
      setTests(testsRes.data.data);
      setStudents(studentsRes.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filterScores = () => {
    let filtered = [...scores];
    if (selectedClass) {
      filtered = filtered.filter(score => score.classId && (score.classId._id === selectedClass || score.classId === selectedClass));
    }
    if (selectedTest) {
      filtered = filtered.filter(score => score.testId && (score.testId._id === selectedTest || score.testId === selectedTest));
    }
    if (selectedStudent) {
      filtered = filtered.filter(score => score.studentId && (score.studentId._id === selectedStudent || score.studentId === selectedStudent));
    }
    setFilteredScores(filtered);
  };

  const handleDelete = async (scoreId) => {
    if (window.confirm('Are you sure you want to delete this score?')) {
      try {
        await axios.delete(`http://localhost:5000/api/scores/${scoreId}`);
        setScores(scores.filter(score => score._id !== scoreId));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete score');
      }
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
        <h1 className="text-3xl font-bold text-gray-900">Test Scores</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and manage test scores for your classes
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="classFilter" className="font-medium text-gray-700 mb-1">Class</label>
          <select
            id="classFilter"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-sky-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 min-w-[180px] bg-white text-sky-800 hover:border-sky-300 transition-colors duration-200 cursor-pointer"
          >
            <option value="" className="text-sky-800 bg-white hover:bg-sky-50">All Classes</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id} className="text-sky-800 bg-white hover:bg-sky-50">{cls.className}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="testFilter" className="font-medium text-gray-700 mb-1">Test</label>
          <select
            id="testFilter"
            value={selectedTest}
            onChange={e => setSelectedTest(e.target.value)}
            className="px-3 py-2 border border-sky-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 min-w-[180px] bg-white text-sky-800 hover:border-sky-300 transition-colors duration-200 cursor-pointer"
          >
            <option value="" className="text-sky-800 bg-white hover:bg-sky-50">All Tests</option>
            {tests.map(test => (
              <option key={test._id} value={test._id} className="text-sky-800 bg-white hover:bg-sky-50">{test.title}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="studentFilter" className="font-medium text-gray-700 mb-1">Student</label>
          <select
            id="studentFilter"
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className="px-3 py-2 border border-sky-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 min-w-[180px] bg-white text-sky-800 hover:border-sky-300 transition-colors duration-200 cursor-pointer"
          >
            <option value="" className="text-sky-800 bg-white hover:bg-sky-50">All Students</option>
            {students.map(student => (
              <option key={student._id} value={student._id} className="text-sky-800 bg-white hover:bg-sky-50">{student.name}</option>
            ))}
          </select>
        </div>
      </div>

      <ScoreList scores={filteredScores} isTeacher={user.role === 'teacher'} onDelete={handleDelete} />
    </div>
  );
};

export default Scores; 
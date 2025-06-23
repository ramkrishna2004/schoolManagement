import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScoreList from '../components/ScoreList';

const PAGE_SIZE = 10;

const AdminScores = () => {
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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterScores();
    setCurrentPage(1);
    // eslint-disable-next-line
  }, [scores, selectedClass, selectedTest, selectedStudent]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [scoresRes, classesRes, testsRes, studentsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/scores', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('http://localhost:5000/api/classes', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('http://localhost:5000/api/tests', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('http://localhost:5000/api/students', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
      ]);
      setScores(scoresRes.data.data);
      setClasses(classesRes.data.data);
      setTests(testsRes.data.data);
      setStudents(studentsRes.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
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

  const paginatedScores = filteredScores.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil(filteredScores.length / PAGE_SIZE);

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
        <h1 className="text-3xl font-bold text-gray-900">All Test Scores</h1>
        <p className="mt-2 text-sm text-gray-600">View and filter all test scores by class, test, or student.</p>
      </div>
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="classFilter" className="font-medium text-gray-700 mb-1">Class</label>
          <select
            id="classFilter"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 min-w-[180px]"
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.className}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="testFilter" className="font-medium text-gray-700 mb-1">Test</label>
          <select
            id="testFilter"
            value={selectedTest}
            onChange={e => setSelectedTest(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 min-w-[180px]"
          >
            <option value="">All Tests</option>
            {tests.map(test => (
              <option key={test._id} value={test._id}>{test.title}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="studentFilter" className="font-medium text-gray-700 mb-1">Student</label>
          <select
            id="studentFilter"
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 min-w-[180px]"
          >
            <option value="">All Students</option>
            {students.map(student => (
              <option key={student._id} value={student._id}>{student.name}</option>
            ))}
          </select>
        </div>
      </div>
      <ScoreList scores={paginatedScores} isTeacher={false} />
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-medium">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminScores; 
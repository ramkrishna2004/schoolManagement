import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { useAuth } from '../contexts/AuthContext';

const PAGE_SIZE = 10;

const ScoreList = ({ onDelete, isTeacher = false, scores: propScores }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [testTitles, setTestTitles] = useState({});
  const [studentNames, setStudentNames] = useState({});
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scores, setScores] = useState([]);
  const [classId, setClassId] = useState('');
  const [testId, setTestId] = useState('');
  const [classes, setClasses] = useState([]);
  const [tests, setTests] = useState([]);
  // For students: build unique class list from scores
  const [studentClassId, setStudentClassId] = useState('');
  const [studentClasses, setStudentClasses] = useState([]);

  // Fetch filter options on mount
  useEffect(() => {
    async function fetchOptions() {
      if (user && (user.role === 'admin' || user.role === 'teacher')) {
        const [classRes, testRes] = await Promise.all([
          api.get('/api/classes'),
          api.get('/api/tests'),
        ]);
        setClasses(classRes.data.data || []);
        setTests(testRes.data.data || []);
      } else if (user && user.role === 'student') {
        // Build unique class list from propScores
        const uniqueClasses = [];
        const seen = new Set();
        (propScores || []).forEach(score => {
          if (score.classId && score.classId._id && !seen.has(score.classId._id)) {
            uniqueClasses.push(score.classId);
            seen.add(score.classId._id);
          }
        });
        setStudentClasses(uniqueClasses);
        if (uniqueClasses.length > 0) {
          setStudentClassId(uniqueClasses[0]._id);
        }
        const testRes = await api.get('/api/tests');
        setTests(testRes.data.data || []);
      }
    }
    fetchOptions();
    // eslint-disable-next-line
  }, [user, propScores]);

  // For students: filter scores by selected class and test
  const filteredScores = React.useMemo(() => {
    if (user && user.role === 'student') {
      let filtered = propScores || [];
      if (studentClassId) {
        filtered = filtered.filter(score => score.classId && score.classId._id === studentClassId);
      }
      if (testId) {
        filtered = filtered.filter(score => score.testId && score.testId._id === testId);
      }
      if (searchTerm) {
        filtered = filtered.filter(score => {
          const testTitle = score.testId?.title || '';
          const className = score.classId?.className || '';
          const studentName = score.studentId?.name || '';
          return (
            testTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            className.toLowerCase().includes(searchTerm.toLowerCase()) ||
            studentName.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      }
      return filtered;
    }
    // admin/teacher logic unchanged
    let filtered = scores;
    if (searchTerm) {
      filtered = filtered.filter(score => {
        const testTitle = score.testId?.title || '';
        const className = score.classId?.className || '';
        const studentName = score.studentId?.name || '';
        return (
          testTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          className.toLowerCase().includes(searchTerm.toLowerCase()) ||
          studentName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    return filtered;
  }, [user, propScores, studentClassId, testId, searchTerm, scores]);

  // When any filter changes, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [classId, testId, searchTerm]);

  // Fetch scores from backend with filters
  const fetchScores = async (page = 1) => {
    try {
      const params = {
        page,
        limit: PAGE_SIZE,
        ...(searchTerm ? { search: searchTerm } : {}),
        ...(classId ? { classId } : {}),
        ...(testId ? { testId } : {})
      };
      const response = await api.get('/api/scores', { params });
      setScores(response.data.data);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      console.error('Failed to fetch scores:', err);
    }
  };

  // useEffect will re-run fetchScores when currentPage or any filter changes
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'teacher')) {
      fetchScores(currentPage);
    }
    // eslint-disable-next-line
  }, [currentPage, classId, testId, searchTerm, user]);

  useEffect(() => {
    // Find all unique testIds that are missing a title
    const missingTestIds = scores
      .filter(score => score.testId && !score.testId.title)
      .map(score => typeof score.testId === 'string' ? score.testId : score.testId._id)
      .filter((id, idx, arr) => arr.indexOf(id) === idx && id);

    // Fetch titles for missing testIds
    missingTestIds.forEach((testId) => {
      if (!testTitles[testId]) {
        api.get(`/api/tests/${testId}`)
          .then(res => {
            setTestTitles(prev => ({
              ...prev,
              [testId]: res.data.data.title
            }));
          })
          .catch(() => {
            setTestTitles(prev => ({ ...prev, [testId]: '' }));
          });
      }
    });

    // Find all unique studentIds that are missing a name
    const missingStudentIds = scores
      .filter(score => score.studentId && !score.studentId.name)
      .map(score => typeof score.studentId === 'string' ? score.studentId : score.studentId._id)
      .filter((id, idx, arr) => arr.indexOf(id) === idx && id);

    // Fetch names for missing studentIds
    if (missingStudentIds.length > 0) {
      api.post('/api/students/batch', { ids: missingStudentIds })
        .then(res => {
          const nameMap = {};
          res.data.data.forEach(student => {
            nameMap[student._id] = student.name;
          });
          setStudentNames(prev => ({ ...prev, ...nameMap }));
        })
        .catch(() => {});
    }
    // eslint-disable-next-line
  }, [scores]);

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-sky-100">
      <div className="p-4 border-b border-sky-200 bg-sky-50 rounded-t-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-sky-800 sm:text-3xl sm:truncate">
              Scores
            </h2>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
            {/* Student class dropdown */}
            {user && user.role === 'student' && studentClasses.length > 1 && (
              <select
                value={studentClassId}
                onChange={e => setStudentClassId(e.target.value)}
                className="block w-full md:w-40 px-3 py-2 border border-sky-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 sm:text-sm bg-white text-sky-800 hover:border-sky-300 transition-colors duration-200 cursor-pointer"
              >
                {studentClasses.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.className}</option>
                ))}
              </select>
            )}
            {/* Admin/Teacher class dropdown */}
            {user && (user.role === 'admin' || user.role === 'teacher') && (
              <select
                value={classId}
                onChange={e => setClassId(e.target.value)}
                className="block w-full md:w-40 px-3 py-2 border border-sky-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 sm:text-sm bg-white text-sky-800 hover:border-sky-300 transition-colors duration-200 cursor-pointer"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.className}</option>
                ))}
              </select>
            )}
            <select
              value={testId}
              onChange={e => setTestId(e.target.value)}
              className="block w-full md:w-40 px-3 py-2 border border-sky-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 sm:text-sm bg-white text-sky-800 hover:border-sky-300 transition-colors duration-200 cursor-pointer"
            >
              <option value="">All Tests</option>
              {tests.map(test => (
                <option key={test._id} value={test._id}>{test.title}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search scores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full md:w-64 px-3 py-2 border border-sky-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm bg-white text-blue-900"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-sky-100">
          <thead className="bg-sky-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test
              </th>
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              >
                Score
                <span className="ml-1">
                  {sortOrder === 'asc' ? '▲' : '▼'}
                </span>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              {isTeacher && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-sky-50">
            {filteredScores.map((score, index) => (
              <tr key={score._id} className="hover:bg-blue-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {score.testId?.title || testTitles[score.testId?._id || score.testId] || ''}
                  </div>
                  <div className="text-sm text-gray-500">
                    {score.testId ? score.testId.subject : ''}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{score.classId ? score.classId.className : ''}</div>
                  <div className="text-sm text-gray-500">{score.classId ? score.classId.subjectName : ''}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{score.studentId?.name || studentNames[score.studentId?._id || score.studentId] || ''}</div>
                  <div className="text-sm text-gray-500">{score.studentId?.email || ''}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm
                    ${score.score >= 40 ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}
                  >
                    {score.score}%
                    {typeof score.obtainedMarks === 'number' && typeof score.totalMarks === 'number' && (
                      <span className="ml-2 text-gray-500 text-xs">({score.obtainedMarks}/{score.totalMarks})</span>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(score.submissionDate).toLocaleDateString()}
                </td>
                {isTeacher && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onDelete(score._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => fetchScores(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-sky-200 text-blue-900 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-medium text-blue-900">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => fetchScores(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-sky-200 text-blue-900 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ScoreList; 
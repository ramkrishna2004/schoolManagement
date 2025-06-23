import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScoreList = ({ scores, onDelete, isTeacher = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, test, class, student
  const [testTitles, setTestTitles] = useState({});
  const [studentNames, setStudentNames] = useState({});
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    // Find all unique testIds that are missing a title
    const missingTestIds = scores
      .filter(score => score.testId && !score.testId.title)
      .map(score => typeof score.testId === 'string' ? score.testId : score.testId._id)
      .filter((id, idx, arr) => arr.indexOf(id) === idx && id);

    // Fetch titles for missing testIds
    missingTestIds.forEach((testId) => {
      if (!testTitles[testId]) {
        axios.get(`http://localhost:5000/api/tests/${testId}`)
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
      axios.post('http://localhost:5000/api/students/batch', { ids: missingStudentIds })
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

  const filteredScores = scores.filter(score => {
    const matchesSearch = 
      (score.testId?.title || testTitles[score.testId?._id || score.testId] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (score.classId?.className || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (score.studentId?.name || studentNames[score.studentId?._id || score.studentId] || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'test') return matchesSearch && score.testId;
    if (filterBy === 'class') return matchesSearch && score.classId;
    if (filterBy === 'student') return matchesSearch && score.studentId;
    
    return matchesSearch;
  });

  // Sort by score
  const sortedScores = [...filteredScores].sort((a, b) => {
    if (sortOrder === 'asc') return a.score - b.score;
    return b.score - a.score;
  });

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
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="block w-full md:w-40 px-3 py-2 border border-sky-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 sm:text-sm bg-white text-sky-800 hover:border-sky-300 transition-colors duration-200 cursor-pointer"
            >
              <option value="all" className="text-sky-800 bg-white hover:bg-sky-50">All</option>
              <option value="test" className="text-sky-800 bg-white hover:bg-sky-50">By Test</option>
              <option value="class" className="text-sky-800 bg-white hover:bg-sky-50">By Class</option>
              <option value="student" className="text-sky-800 bg-white hover:bg-sky-50">By Student</option>
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
            {sortedScores.map((score, index) => (
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
    </div>
  );
};

export default ScoreList; 
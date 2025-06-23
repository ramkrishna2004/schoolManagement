import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManualScoreEntry = ({ testId }) => {
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setMsg('');
    let classId = null;
    let fetchedStudents = [];
    let fetchedScores = [];
    // Fetch test details
    axios.get(`/api/tests/${testId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => {
        const testData = res.data.data;
        if (testData.classId) {
          classId = typeof testData.classId === 'object' && testData.classId._id ? testData.classId._id : testData.classId;
        }
        if (!classId) {
          setStudents([]);
          setScores([]);
          setError('This test is not associated with a class.');
          return;
        }
        // Fetch students
        axios.get(`/api/classes/${classId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
          .then(res2 => {
            fetchedStudents = res2.data.data.studentIds || [];
            setStudents(fetchedStudents);
            // Fetch existing scores for this test
            axios.get(`/api/scores?testId=${testId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
              .then(res3 => {
                fetchedScores = res3.data.data || [];
                // Map scores to students
                const scoresArr = fetchedStudents.map(stu => {
                  const found = fetchedScores.find(s => (s.studentId._id || s.studentId) === stu._id);
                  return {
                    studentId: stu._id,
                    obtainedMarks: found ? found.obtainedMarks : '',
                    totalMarks: found ? found.totalMarks : ''
                  };
                });
                setScores(scoresArr);
              })
              .catch(() => {
                setScores(fetchedStudents.map(stu => ({ studentId: stu._id, obtainedMarks: '', totalMarks: '' })));
              });
          })
          .catch(() => {
            setStudents([]);
            setScores([]);
            setError('Could not fetch students for this class.');
          });
      })
      .catch(() => {
        setError('Could not fetch test details.');
      });
  }, [testId]);

  const handleChange = (idx, field, value) => {
    const updated = [...scores];
    updated[idx] = { ...updated[idx], [field]: value, studentId: students[idx]._id };
    setScores(updated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    // Calculate score as percentage for each student
    const scoresWithPercentage = scores.map(entry => {
      const obtained = Number(entry.obtainedMarks);
      const total = Number(entry.totalMarks);
      const score = total > 0 ? Math.round((obtained / total) * 100) : 0;
      return { ...entry, score };
    });
    try {
      await axios.post('/api/offline-tests/score-entry', {
        testId,
        scores: scoresWithPercentage
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setMsg('Scores submitted!');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error submitting scores');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (idx) => {
    setLoading(true);
    setMsg('');
    const entry = scores[idx];
    try {
      await axios.put('/api/offline-tests/update-score-entry', {
        testId,
        studentId: entry.studentId,
        obtainedMarks: entry.obtainedMarks,
        totalMarks: entry.totalMarks
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setMsg('Score updated!');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error updating score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Manual Score Entry</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {students.map((student, idx) => (
        <div key={student._id} className="flex items-center mb-2 gap-2">
          <span className="w-40">{student.name}</span>
          <input type="number" placeholder="Obtained Marks" required min={0}
            value={scores[idx]?.obtainedMarks || ''} onChange={e => handleChange(idx, 'obtainedMarks', e.target.value)} className="input mx-2" />
          <input type="number" placeholder="Total Marks" required min={0}
            value={scores[idx]?.totalMarks || ''} onChange={e => handleChange(idx, 'totalMarks', e.target.value)} className="input mx-2" />
          <button type="button" className="btn btn-secondary ml-2" onClick={() => handleUpdate(idx)} disabled={loading || !!error}>
            Update
          </button>
        </div>
      ))}
      <button type="submit" className="btn btn-primary mt-4" disabled={loading || !!error}>{loading ? 'Submitting...' : 'Submit Scores'}</button>
      {msg && <div className="mt-2 text-sm text-blue-600">{msg}</div>}
    </form>
  );
};

export default ManualScoreEntry; 
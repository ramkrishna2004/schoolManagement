import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimatedInput from './AnimatedInput';

const testTypes = ['Unit Test', 'Mid Term', 'Final', 'Quiz'];

const OfflineTestForm = ({ onTestCreated }) => {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    testTitle: '', subjectName: '', classId: '',
    type: '', totalMarks: '', passingMarks: '', duration: '', scheduledDate: '', startTime: '', endTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get('/api/classes', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setClasses(res.data.data || []));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await axios.post('/api/offline-tests/create', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMsg('Offline test created!');
      setForm({ testTitle: '', subjectName: '', classId: '', type: '', totalMarks: '', passingMarks: '', duration: '', scheduledDate: '', startTime: '', endTime: '' });
      onTestCreated && onTestCreated(res.data.data);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error creating test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Offline Test</h2>
      <AnimatedInput name="testTitle" value={form.testTitle} onChange={handleChange} label="Test Title" required className="mb-2" />
      <AnimatedInput name="subjectName" value={form.subjectName} onChange={handleChange} label="Subject" required className="mb-2" />
      <select name="classId" value={form.classId} onChange={handleChange} required className="input mb-2">
        <option value="">Select Class</option>
        {classes.map(cls => <option key={cls._id} value={cls._id}>{cls.className}</option>)}
      </select>
      <select name="type" value={form.type} onChange={handleChange} required className="input mb-2">
        <option value="">Select Test Type</option>
        {testTypes.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <AnimatedInput name="totalMarks" type="number" value={form.totalMarks} onChange={handleChange} label="Total Marks" required className="mb-2" min={1} />
      <AnimatedInput name="passingMarks" type="number" value={form.passingMarks} onChange={handleChange} label="Passing Marks" required className="mb-2" min={0} />
      <AnimatedInput name="duration" type="number" value={form.duration} onChange={handleChange} label="Duration (minutes)" required className="mb-2" min={1} />
      <AnimatedInput name="scheduledDate" type="date" value={form.scheduledDate} onChange={handleChange} label="Scheduled Date" required className="mb-2" />
      <AnimatedInput name="startTime" type="time" value={form.startTime} onChange={handleChange} label="Start Time" required className="mb-2" />
      <AnimatedInput name="endTime" type="time" value={form.endTime} onChange={handleChange} label="End Time" required className="mb-2" />
      <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-400 rounded-lg shadow hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" disabled={loading}>{loading ? 'Creating...' : 'Create Test'}</button>
      {msg && <div className="mt-2 text-sm text-blue-600">{msg}</div>}
    </form>
  );
};

export default OfflineTestForm; 
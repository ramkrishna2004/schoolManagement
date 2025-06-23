import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      <input name="testTitle" value={form.testTitle} onChange={handleChange} placeholder="Test Title" required className="input mb-2" />
      <input name="subjectName" value={form.subjectName} onChange={handleChange} placeholder="Subject" required className="input mb-2" />
      <select name="classId" value={form.classId} onChange={handleChange} required className="input mb-2">
        <option value="">Select Class</option>
        {classes.map(cls => <option key={cls._id} value={cls._id}>{cls.className}</option>)}
      </select>
      <select name="type" value={form.type} onChange={handleChange} required className="input mb-2">
        <option value="">Select Test Type</option>
        {testTypes.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <input name="totalMarks" type="number" value={form.totalMarks} onChange={handleChange} placeholder="Total Marks" required className="input mb-2" min={1} />
      <input name="passingMarks" type="number" value={form.passingMarks} onChange={handleChange} placeholder="Passing Marks" required className="input mb-2" min={0} />
      <input name="duration" type="number" value={form.duration} onChange={handleChange} placeholder="Duration (minutes)" required className="input mb-2" min={1} />
      <input name="scheduledDate" type="date" value={form.scheduledDate} onChange={handleChange} required className="input mb-2" />
      <input name="startTime" type="time" value={form.startTime} onChange={handleChange} required className="input mb-2" />
      <input name="endTime" type="time" value={form.endTime} onChange={handleChange} required className="input mb-2" />
      <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Test'}</button>
      {msg && <div className="mt-2 text-sm text-blue-600">{msg}</div>}
    </form>
  );
};

export default OfflineTestForm; 
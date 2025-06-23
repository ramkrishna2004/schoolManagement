import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EventAvailable, Add, Edit, Delete, Save, Cancel } from '@mui/icons-material';

function AdminHolidays() {
  const [holidays, setHolidays] = useState([]);
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editReason, setEditReason] = useState('');

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await axios.get('/api/holidays');
      setHolidays(response.data.data);
    } catch (err) {
      setError('Failed to fetch holidays');
    }
  };

  const addHoliday = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/holidays', { date, reason });
      setHolidays([...holidays, response.data.data]);
      setDate('');
      setReason('');
      setSuccess('Holiday added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add holiday');
      setTimeout(() => setError(''), 3000);
    }
  };

  const startEdit = (holiday) => {
    setEditingId(holiday._id);
    setEditDate(holiday.date.split('T')[0]);
    setEditReason(holiday.reason);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDate('');
    setEditReason('');
  };

  const updateHoliday = async (id) => {
    try {
      const response = await axios.put(`/api/holidays/${id}`, {
        date: editDate,
        reason: editReason
      });
      setHolidays(holidays.map(h => h._id === id ? response.data.data : h));
      setEditingId(null);
      setEditDate('');
      setEditReason('');
      setSuccess('Holiday updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update holiday');
      setTimeout(() => setError(''), 3000);
    }
  };

  const deleteHoliday = async (id) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        await axios.delete(`/api/holidays/${id}`);
        setHolidays(holidays.filter(h => h._id !== id));
        setSuccess('Holiday deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete holiday');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 py-8 px-2 sm:px-6 lg:px-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-700 flex items-center gap-2">
          <EventAvailable className="text-sky-400" /> Manage Holidays
        </h1>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2 justify-center">
          <EventAvailable /> {success}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2 justify-center">
          <Delete /> {error}
        </div>
      )}

      {/* Add Holiday Form */}
      <form onSubmit={addHoliday} className="bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto mb-8 flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sky-900 font-semibold mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-sky-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sky-900 font-semibold mb-1">Reason</label>
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Reason"
            className="w-full border border-sky-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 bg-sky-400 hover:bg-sky-500 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
        >
          <Add /> Add Holiday
        </button>
      </form>

      {/* Holiday List */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-sky-700 mb-4">Holiday List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-sky-200">
            <thead className="bg-sky-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-sky-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-sky-100">
              {holidays.map(holiday => (
                <tr key={holiday._id} className="hover:bg-sky-50 transition-colors">
                  {editingId === holiday._id ? (
                    // Edit Mode
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="date"
                          value={editDate}
                          onChange={e => setEditDate(e.target.value)}
                          className="border border-sky-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editReason}
                          onChange={e => setEditReason(e.target.value)}
                          className="border border-sky-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-400 w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => updateHoliday(holiday._id)}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          >
                            <Save className="w-4 h-4" /> Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                          >
                            <Cancel className="w-4 h-4" /> Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-900">
                        {new Date(holiday.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-900">
                        {holiday.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(holiday)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => deleteHoliday(holiday._id)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          >
                            <Delete className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {holidays.length === 0 && (
            <div className="text-center text-sky-400 py-6">No holidays added yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHolidays; 
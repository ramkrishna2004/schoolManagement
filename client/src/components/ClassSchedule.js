import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ScheduleForm from './ScheduleForm';
import ScheduleList from './ScheduleList';
import ScheduleCalendar from './ScheduleCalendar';

function ClassSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedDay, setSelectedDay] = useState('All');
  const { user } = useAuth();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schedules', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSchedules(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch schedules');
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (scheduleData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/schedules', scheduleData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSchedules([...schedules, response.data.data]);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create schedule');
    }
  };

  const handleUpdateSchedule = async (id, scheduleData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/schedules/${id}`, scheduleData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSchedules(schedules.map(schedule => 
        schedule._id === id ? response.data.data : schedule
      ));
      setSelectedSchedule(null);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update schedule');
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await axios.delete(`http://localhost:5000/api/schedules/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSchedules(schedules.filter(schedule => schedule._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete schedule');
      }
    }
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Class Schedule
          </h2>
        </div>
        {user.role === 'admin' && (
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button
              onClick={() => {
                setSelectedSchedule(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Schedule
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Calendar View
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mt-4">
          <ScheduleForm
            onSubmit={selectedSchedule ? handleUpdateSchedule : handleCreateSchedule}
            onCancel={() => {
              setShowForm(false);
              setSelectedSchedule(null);
            }}
            initialData={selectedSchedule}
          />
        </div>
      )}

      <div className="mt-8">
        {viewMode === 'list' ? (
          <ScheduleList
            schedules={schedules}
            onEdit={handleEdit}
            onDelete={handleDeleteSchedule}
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
          />
        ) : (
          <ScheduleCalendar
            schedules={schedules}
            onEdit={handleEdit}
            onDelete={handleDeleteSchedule}
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
          />
        )}
      </div>
    </div>
  );
}

export default ClassSchedule; 
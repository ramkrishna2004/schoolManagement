import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import TestResult from './TestResult';
import Timer from '../../components/common/Timer';
import Clock from '../../components/common/Clock';

function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [now, setNow] = useState(new Date());
  const { token, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Update 'now' every minute
    return () => clearInterval(timer);
  }, []);

  const fetchTests = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/tests', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Assuming the backend attaches `myAttempt` to each test object for the student
      setTests(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tests. Please try again later.');
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchTests();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user, fetchTests]);

  const handleStartTest = async (testId, isInProgress) => {
    if (!token) {
      setError('Authentication required to start a test.');
      return;
    }

    try {
      if (!isInProgress) {
        // Only call start if it's a new attempt
        await axios.post(`http://localhost:5000/api/tests/${testId}/attempts/start`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
        navigate(`/student/tests/${testId}/take`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start test attempt');
      console.error('Error starting test attempt:', err);
    }
  };

  const getTestStatus = (test) => {
    if (test.myAttempt && test.myAttempt.status === 'completed') {
      return { status: 'COMPLETED', canTake: false };
    }
    
    if (test.myAttempt && test.myAttempt.status === 'in-progress') {
       const attemptStartTime = new Date(test.myAttempt.startTime);
       const attemptEndTime = new Date(attemptStartTime.getTime() + test.duration * 60000);
       if (now > attemptEndTime) {
         return { status: 'EXPIRED', canTake: false };
       }
      return { status: 'IN_PROGRESS', canTake: true, endTime: attemptEndTime };
    }

    if (!test.scheduledDate || !test.startTime || !test.endTime) {
      return { status: 'CONFIG_ERROR', canTake: false };
    }

    const scheduledDateStr = new Date(test.scheduledDate).toISOString().split('T')[0];
    const [startHour, startMinute] = test.startTime.split(':').map(Number);
    const [endHour, endMinute] = test.endTime.split(':').map(Number);

    const startDateTime = new Date(scheduledDateStr);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(scheduledDateStr);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    if (now < startDateTime) {
      return { status: 'WAITING', canTake: false, startTime: startDateTime };
    }
    if (now > endDateTime) {
      return { status: 'EXPIRED', canTake: false };
    }

    return { status: 'AVAILABLE', canTake: true, endTime: endDateTime };
  };

  const filteredTests = tests.filter(test => {
    const searchLower = searchTerm.toLowerCase();
    return (
      test.title.toLowerCase().includes(searchLower) ||
      test.subject.toLowerCase().includes(searchLower) ||
      (test.classId?.className || '').toLowerCase().includes(searchLower)
    );
  });

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-end mb-4">
        <Clock />
      </div>
      
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Your Tests
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and take tests for your enrolled classes.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow-2xl rounded-3xl border-2 border-sky-200 overflow-hidden">
                <table className="min-w-full divide-y divide-sky-200">
                  <thead className="bg-gradient-to-r from-sky-200 to-sky-100">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Test Title</th>
                      <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Subject</th>
                      <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Class</th>
                      <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Duration</th>
                      <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Scheduled</th>
                      <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Status & Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.map((test, idx) => {
                      const { status, canTake, startTime, endTime } = getTestStatus(test);
                      
                      return (
                      <tr key={test._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50 hover:bg-sky-100 transition'}>
                        <td className="px-8 py-5 whitespace-nowrap text-blue-900 font-semibold text-base">{test.title}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-blue-800 text-base">{test.subject}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-blue-800 text-base">{test.classId?.className}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-blue-700 text-base">{test.duration} mins</td>
                        <td className="px-8 py-5 whitespace-nowrap text-blue-700 text-base">
                            {test.scheduledDate ? new Date(test.scheduledDate).toLocaleDateString() : ''}
                            <div className="text-xs text-gray-500">{test.startTime} - {test.endTime}</div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-base font-medium">
                           {status === 'COMPLETED' && (
                              <button onClick={() => navigate(`/student/tests/${test._id}/results`)} className="bg-green-200 text-green-900 px-4 py-2 rounded-xl shadow hover:bg-green-300 font-semibold transition text-base">
                                View Result
                              </button>
                            )}
                            {status === 'AVAILABLE' && canTake && (
                                <div>
                                    <button onClick={() => handleStartTest(test._id, false)} className="bg-sky-200 text-sky-900 px-4 py-2 rounded-xl shadow hover:bg-sky-300 font-semibold transition text-base">
                                        Start Test
                                    </button>
                                    <Timer targetDate={endTime} prefix="Ends in:" onExpire={fetchTests} />
                                </div>
                            )}
                             {status === 'IN_PROGRESS' && canTake && (
                                <div>
                                    <button onClick={() => handleStartTest(test._id, true)} className="bg-yellow-200 text-yellow-900 px-4 py-2 rounded-xl shadow hover:bg-yellow-300 font-semibold transition text-base">
                                        Continue Test
                                    </button>
                                     <Timer targetDate={endTime} prefix="Time left:" onExpire={fetchTests} />
                                </div>
                            )}
                            {status === 'WAITING' && (
                               <Timer targetDate={startTime} prefix="Starts in:" onExpire={fetchTests} />
                            )}
                            {status === 'EXPIRED' && (
                              <span className="text-sm font-medium text-red-600">Expired</span>
                            )}
                             {status === 'CONFIG_ERROR' && (
                              <span className="text-sm font-medium text-red-600">Test not configured</span>
                            )}
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Tests as default, TestResult }; 
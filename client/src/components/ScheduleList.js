import React, { useState, useEffect } from 'react';

function ScheduleList({ schedules, onEdit, onDelete, selectedDay, onDaySelect }) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedClass, setSelectedClass] = useState('All');
  const [uniqueClasses, setUniqueClasses] = useState([]);

  useEffect(() => {
    // Extract unique classes from schedules
    const classes = [...new Set(schedules.map(schedule => 
      schedule.classId?.className || 'Unknown'
    ))].sort();
    setUniqueClasses(classes);
  }, [schedules]);

  const filteredSchedules = schedules.filter(schedule => {
    const dayMatch = selectedDay === 'All' || schedule.dayOfWeek === selectedDay;
    const classMatch = selectedClass === 'All' || schedule.classId?.className === selectedClass;
    return dayMatch && classMatch;
  });

  // Group schedules by class
  const schedulesByClass = filteredSchedules.reduce((acc, schedule) => {
    const className = schedule.classId?.className || 'Unknown';
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(schedule);
    return acc;
  }, {});

  return (
    <div className="bg-white shadow-2xl rounded-3xl border-2 border-sky-200 overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-sky-800">Schedule List</h3>
          <div className="flex space-x-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-48 pl-3 pr-10 py-2 text-base border-sky-200 focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm rounded-md"
            >
              <option value="All">All Classes</option>
              {uniqueClasses.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
            <select
              value={selectedDay}
              onChange={(e) => onDaySelect(e.target.value)}
              className="block w-48 pl-3 pr-10 py-2 text-base border-sky-200 focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm rounded-md"
            >
              <option value="All">All Days</option>
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-sky-100">
        {selectedClass === 'All' ? (
          // Show schedules grouped by class
          Object.entries(schedulesByClass).map(([className, classSchedules]) => (
            <div key={className} className="border-b border-sky-100 last:border-b-0">
              <div className="bg-sky-50 px-6 py-3">
                <h4 className="text-lg font-extrabold text-sky-800">{className}</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-sky-200">
                  <thead className="bg-gradient-to-r from-sky-200 to-sky-100">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Day</th>
                      <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Time</th>
                      <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Subject</th>
                      <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Teacher</th>
                      <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Room</th>
                      <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classSchedules.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-8 py-6 text-center text-base text-gray-500">No schedules found</td>
                      </tr>
                    ) : (
                      classSchedules.map((schedule, idx) => (
                        <tr key={schedule._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50 hover:bg-sky-100 transition'}>
                          <td className="px-8 py-5 whitespace-nowrap text-blue-900 font-semibold text-base">{schedule.dayOfWeek}</td>
                          <td className="px-8 py-5 whitespace-nowrap text-blue-800 text-base">{schedule.startTime} - {schedule.endTime}</td>
                          <td className="px-8 py-5 whitespace-nowrap text-blue-800 text-base">{schedule.subject || 'N/A'}</td>
                          <td className="px-8 py-5 whitespace-nowrap text-blue-700 text-base">{schedule.teacherId?.name || 'N/A'}</td>
                          <td className="px-8 py-5 whitespace-nowrap text-blue-700 text-base">{schedule.room}</td>
                          <td className="px-8 py-5 whitespace-nowrap text-base font-medium flex gap-3 justify-end">
                            <button
                              onClick={() => onEdit(schedule)}
                              className="bg-yellow-200 text-yellow-900 px-4 py-2 rounded-xl shadow hover:bg-yellow-300 font-semibold transition text-base"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDelete(schedule._id)}
                              className="bg-red-200 text-red-800 px-4 py-2 rounded-xl shadow hover:bg-red-300 font-semibold transition text-base"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          // Show single class schedule
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sky-200">
              <thead className="bg-gradient-to-r from-sky-200 to-sky-100">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Day</th>
                  <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Time</th>
                  <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Subject</th>
                  <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Teacher</th>
                  <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Room</th>
                  <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-6 text-center text-base text-gray-500">No schedules found</td>
                  </tr>
                ) : (
                  filteredSchedules.map((schedule, idx) => (
                    <tr key={schedule._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50 hover:bg-sky-100 transition'}>
                      <td className="px-8 py-5 whitespace-nowrap text-blue-900 font-semibold text-base">{schedule.dayOfWeek}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-blue-800 text-base">{schedule.startTime} - {schedule.endTime}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-blue-800 text-base">{schedule.subject || 'N/A'}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-blue-700 text-base">{schedule.teacherId?.name || 'N/A'}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-blue-700 text-base">{schedule.room}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-base font-medium flex gap-3 justify-end">
                        <button
                          onClick={() => onEdit(schedule)}
                          className="bg-yellow-200 text-yellow-900 px-4 py-2 rounded-xl shadow hover:bg-yellow-300 font-semibold transition text-base"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(schedule._id)}
                          className="bg-red-200 text-red-800 px-4 py-2 rounded-xl shadow hover:bg-red-300 font-semibold transition text-base"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScheduleList; 
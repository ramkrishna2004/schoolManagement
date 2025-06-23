import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ScheduleCalendar({ schedules, onEdit, onDelete, selectedDay, onDaySelect }) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );
  const [selectedClass, setSelectedClass] = useState('');
  const [uniqueClasses, setUniqueClasses] = useState([]);

  useEffect(() => {
    // Extract unique classes from schedules
    const classes = [...new Set(schedules.map(schedule => 
      schedule.classId?.className || 'Unknown'
    ))].sort();
    setUniqueClasses(classes);
    // Set the first class as selected by default
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]);
    }
  }, [schedules]);

  const filteredSchedules = schedules.filter(schedule => {
    const dayMatch = selectedDay === 'All' || schedule.dayOfWeek === selectedDay;
    const classMatch = schedule.classId?.className === selectedClass;
    return dayMatch && classMatch;
  });

  const getScheduleForTimeSlot = (day, time) => {
    return filteredSchedules.find(schedule => {
      if (schedule.dayOfWeek !== day) return false;
      
      const [startHour] = schedule.startTime.split(':');
      const [endHour] = schedule.endTime.split(':');
      const [currentHour] = time.split(':');
      
      return parseInt(currentHour) >= parseInt(startHour) && 
             parseInt(currentHour) < parseInt(endHour);
    });
  };

  return (
    <div className="bg-white shadow-2xl rounded-3xl border-2 border-sky-200 overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-sky-200 to-sky-100">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-sky-800">
            Weekly Schedule - <span className="text-blue-900">{selectedClass}</span>
          </h3>
          <div className="flex space-x-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-48 pl-3 pr-10 py-2 text-base border-sky-200 focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm rounded-md shadow"
            >
              {uniqueClasses.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
            <select
              value={selectedDay}
              onChange={(e) => onDaySelect(e.target.value)}
              className="block w-48 pl-3 pr-10 py-2 text-base border-sky-200 focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm rounded-md shadow"
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-sky-200">
            <thead className="bg-gradient-to-r from-sky-200 to-sky-100">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-extrabold text-sky-800 uppercase tracking-widest">Time</th>
                {daysOfWeek.map(day => (
                  <th
                    key={day}
                    className={`px-8 py-4 text-left text-sm font-extrabold uppercase tracking-widest transition-colors duration-300 ${selectedDay === day ? 'bg-sky-100 text-sky-900' : 'text-sky-800'}`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time} className={parseInt(time) % 2 === 0 ? 'bg-white' : 'bg-sky-50'}>
                  <td className="px-8 py-5 whitespace-nowrap text-blue-900 font-semibold text-base">{time}</td>
                  {daysOfWeek.map(day => {
                    const schedule = getScheduleForTimeSlot(day, time);
                    return (
                      <td
                        key={`${day}-${time}`}
                        className={`px-4 py-3 whitespace-nowrap align-top relative group transition-colors duration-300 ${selectedDay === day ? 'bg-sky-50' : ''}`}
                      >
                        <AnimatePresence>
                          {schedule ? (
                            <motion.div
                              key={schedule._id}
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.25 }}
                              className="bg-blue-100 border border-sky-200 p-2 rounded-xl shadow-md hover:shadow-xl transition group-hover:scale-105 group-hover:bg-blue-200 cursor-pointer"
                            >
                              <div className="text-blue-700 font-bold text-sm">
                                {schedule.startTime} - {schedule.endTime}
                              </div>
                              <div className="text-blue-800 text-xs font-semibold">
                                {schedule.teacherId?.name || 'N/A'}
                              </div>
                              <div className="text-blue-600 text-xs">Subject: {schedule.subject || 'N/A'}</div>
                              <div className="text-blue-500 text-xs">Room: {schedule.room}</div>
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                                className="mt-2 flex space-x-2 opacity-80 group-hover:opacity-100"
                              >
                                <button
                                  onClick={() => onEdit(schedule)}
                                  className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded shadow hover:bg-yellow-300 text-xs font-semibold transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => onDelete(schedule._id)}
                                  className="bg-red-200 text-red-800 px-2 py-1 rounded shadow hover:bg-red-300 text-xs font-semibold transition"
                                >
                                  Delete
                                </button>
                              </motion.div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="empty"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-gray-400 text-xs text-center"
                            >
                              -
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ScheduleCalendar; 
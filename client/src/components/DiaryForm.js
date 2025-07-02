import React, { useState, useEffect } from 'react';
import AnimatedInput from './AnimatedInput';

const DiaryForm = ({ onSubmit, initialData, classOptions, onCancel }) => {
  const [date, setDate] = useState(initialData?.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState(initialData?.entries || [{ subject: '', work: '' }]);
  const [classId, setClassId] = useState(initialData?.classId || (classOptions && classOptions.length > 0 ? classOptions[0].value : ''));

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]);
      setEntries(initialData.entries && initialData.entries.length > 0 ? initialData.entries : [{ subject: '', work: '' }]);
      setClassId(initialData.classId || (classOptions && classOptions.length > 0 ? classOptions[0].value : ''));
    }
  }, [initialData, classOptions]);

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const addEntry = () => {
    setEntries([...entries, { subject: '', work: '' }]);
  };

  const removeEntry = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ date, entries, classId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-xl shadow-xl border max-w-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatedInput
          id="date"
          label="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          name="date"
        />
        {classOptions && classOptions.length > 0 && (
          <div className="relative group my-6">
            <select
              className="w-full px-3 py-2 pt-5 bg-white border-2 border-gray-200 rounded-lg shadow-md focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-800 text-sm appearance-none"
              value={classId}
              onChange={e => setClassId(e.target.value)}
              required
              name="classId"
              id="classId"
            >
              {classOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <label htmlFor="classId" className="absolute left-3 top-3.5 text-gray-500 text-base pointer-events-none transition-all duration-200 transform origin-left peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-focus:bg-white peer-focus:px-1 peer-focus:shadow-lg">Class</label>
          </div>
        )}
      </div>

      <hr />

      <h3 className="text-lg font-semibold text-gray-800">Subjects & Work</h3>
      {entries.map((entry, index) => (
        <div key={index} className="space-y-2 border p-4 rounded-md bg-gray-50 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatedInput
              id={`subject-${index}`}
              label="Subject"
              value={entry.subject}
              onChange={e => handleEntryChange(index, 'subject', e.target.value)}
              name="subject"
              autoComplete="off"
            />
            <div className="my-6">
              <label className="block text-gray-600 text-xs mb-1 ml-1">Work / Homework</label>
              <textarea
                className="w-full border-2 border-gray-200 rounded-lg shadow-md p-2 min-h-[40px] focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-gray-800 text-sm"
                placeholder="e.g., Completed chapter 5 exercises"
                value={entry.work}
                onChange={e => handleEntryChange(index, 'work', e.target.value)}
                required
              />
            </div>
          </div>
          {entries.length > 1 && (
            <button
              type="button"
              onClick={() => removeEntry(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
            >
              &times;
            </button>
          )}
        </div>
      ))}
      
      <button
        type="button"
        onClick={addEntry}
        className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
      >
        + Add Subject
      </button>

      <div className="flex space-x-2 pt-4 justify-end">
        <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-400 rounded-lg shadow hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          Save Diary
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-lg shadow hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default DiaryForm; 
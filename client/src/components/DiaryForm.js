import React, { useState, useEffect } from 'react';

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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold text-gray-700">Date</label>
          <input
            type="date"
            className="w-full border rounded p-2 mt-1"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        {classOptions && classOptions.length > 0 && (
          <div>
            <label className="block font-semibold text-gray-700">Class</label>
            <select
              className="w-full border rounded p-2 mt-1"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
            >
              {classOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <hr />

      <h3 className="text-lg font-semibold text-gray-800">Subjects & Work</h3>
      {entries.map((entry, index) => (
        <div key={index} className="space-y-2 border p-4 rounded-md bg-gray-50 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-600">Subject</label>
              <input
                type="text"
                className="w-full border rounded p-2 mt-1"
                placeholder="e.g., Mathematics"
                value={entry.subject}
                onChange={(e) => handleEntryChange(index, 'subject', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-600">Work / Homework</label>
              <textarea
                className="w-full border rounded p-2 mt-1 min-h-[40px]"
                placeholder="e.g., Completed chapter 5 exercises"
                value={entry.work}
                onChange={(e) => handleEntryChange(index, 'work', e.target.value)}
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

      <div className="flex space-x-2 pt-4">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700">
          Save Diary
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default DiaryForm; 
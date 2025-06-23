import React from 'react';

const DiaryList = ({ diaries, onEdit, onDelete, canEdit }) => (
  <div className="space-y-4">
    {diaries.length === 0 && <div className="text-gray-500 text-center py-4">No diary entries found.</div>}
    {diaries.map(diary => (
      <div key={diary._id} className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Diary for {new Date(diary.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
          </div>
          {canEdit && (
            <div className="space-x-2 flex-shrink-0 ml-4">
              <button onClick={() => onEdit(diary)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => onDelete(diary._id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          )}
        </div>
        <div className="mt-3">
          <ul className="space-y-3">
            {diary.entries.map((entry, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded-md">
                <p className="font-semibold text-gray-700">{entry.subject}</p>
                <p className="text-gray-600 whitespace-pre-line ml-2">{entry.work}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>
);

export default DiaryList; 
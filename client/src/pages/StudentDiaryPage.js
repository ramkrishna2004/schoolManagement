import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDiaries } from '../services/diaryService';
import DiaryList from '../components/DiaryList';

const StudentDiaryPage = () => {
  const { user, token } = useAuth();
  const [diaries, setDiaries] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchDiaries(selectedDate, 1); // Reset to page 1 on filter change
    }
  }, [user, selectedDate, token]);

  const fetchDiaries = async (date, page) => {
    setLoading(true);
    // No classId needed for students
    const data = await getDiaries('', date, page, token);
    setDiaries(data.diaries || []);
    setTotalPages(data.totalPages || 0);
    setCurrentPage(data.currentPage || 1);
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchDiaries(selectedDate, newPage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Class Diaries</h2>
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
        <label className="font-semibold mr-2">Filter by Date:</label>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full md:w-auto border rounded p-2 mt-1" />
      </div>
      
      {loading ? <div>Loading diaries...</div> : (
        <>
          <DiaryList diaries={diaries} canEdit={false} />
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">Previous</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentDiaryPage; 
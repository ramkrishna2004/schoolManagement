import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createDiary, getDiaries, updateDiary, deleteDiary } from '../services/diaryService';
import DiaryForm from '../components/DiaryForm';
import DiaryList from '../components/DiaryList';
import axios from 'axios';

const AdminDiaryPage = () => {
  const { user, token } = useAuth();
  const [diaries, setDiaries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all classes
    const fetchClasses = async () => {
      const res = await axios.get('/api/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(res.data.data || []);
      if (res.data.data && res.data.data.length > 0) setSelectedClass(res.data.data[0]._id);
    };
    if (user?.role === 'admin') fetchClasses();
  }, [user, token]);

  useEffect(() => {
    if (selectedClass) {
      fetchDiaries(selectedClass, selectedDate, 1); // Reset to page 1 on filter change
    }
  }, [selectedClass, selectedDate]);

  const fetchDiaries = async (classId, date, page) => {
    setLoading(true);
    const data = await getDiaries(classId, date, page, token);
    setDiaries(data.diaries);
    setTotalPages(data.totalPages);
    setCurrentPage(data.currentPage);
    setLoading(false);
  };
  
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchDiaries(selectedClass, selectedDate, newPage);
    }
  };

  const handleCreate = async (data) => {
    await createDiary(data, token);
    setShowForm(false);
    fetchDiaries(selectedClass, selectedDate, currentPage);
  };

  const handleEdit = (diary) => {
    setEditData(diary);
    setShowForm(true);
  };

  const handleUpdate = async (data) => {
    await updateDiary(editData._id, data, token);
    setEditData(null);
    setShowForm(false);
    fetchDiaries(selectedClass, selectedDate, currentPage);
  };

  const handleDelete = async (id) => {
    await deleteDiary(id, token);
    fetchDiaries(selectedClass, selectedDate, currentPage);
  };

  const classOptions = classes.map(cls => ({ value: cls._id, label: cls.className }));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Class Diaries</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <label className="font-semibold mr-2">Select Class:</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full border rounded p-2 mt-1">
            {classOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold mr-2">Filter by Date:</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full border rounded p-2 mt-1" />
        </div>
        <div className="self-end">
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded mt-1" onClick={() => { setShowForm(true); setEditData(null); }}>Create Diary</button>
        </div>
      </div>
      
      {showForm && (
        <div className="mb-4">
          <DiaryForm
            onSubmit={editData ? handleUpdate : handleCreate}
            initialData={editData}
            classOptions={classOptions}
            onCancel={() => { setShowForm(false); setEditData(null); }}
          />
        </div>
      )}
      
      {loading ? <div>Loading diaries...</div> : (
        <>
          <DiaryList diaries={diaries} onEdit={handleEdit} onDelete={handleDelete} canEdit={true} />
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

export default AdminDiaryPage; 
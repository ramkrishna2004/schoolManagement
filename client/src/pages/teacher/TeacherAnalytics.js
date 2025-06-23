import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import AnalyticsChart from '../../components/AnalyticsChart';

const TeacherAnalytics = () => {
    const { classId } = useParams();
    const [classData, setClassData] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentChartData, setStudentChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClassData = async () => {
            if (!classId) return;
            setLoading(true);
            try {
                const data = await analyticsService.getClassAnalytics(classId);
                setClassData(data);
            } catch (err) {
                setError('Failed to fetch class analytics.');
            } finally {
                setLoading(false);
            }
        };
        fetchClassData();
    }, [classId]);

    useEffect(() => {
        const fetchStudentData = async () => {
            if (!selectedStudent) return;
            try {
                const data = await analyticsService.getStudentAnalyticsById(selectedStudent.studentId);
                setStudentChartData(data);
            } catch (err) {
                console.error('Failed to fetch student analytics', err);
            }
        };
        fetchStudentData();
    }, [selectedStudent]);
    
    if (loading) return <p>Loading class analytics...</p>;
    if (error) return <p>{error}</p>;

    const barChartData = classData ? {
        labels: classData.studentAverages.map(s => s.studentName),
        datasets: [{
            label: 'Student Average Scores',
            data: classData.studentAverages.map(s => s.averageScore),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
        }, {
            label: 'Class Average',
            data: Array(classData.studentAverages.length).fill(classData.classAverage),
            type: 'line',
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
        }]
    } : null;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Class Test Analytics</h1>
            {classData && (
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <h2 className="text-xl font-semibold mb-2">Class Average vs Student Averages</h2>
                    <AnalyticsChart type="bar" data={barChartData} />
                </div>
            )}
            
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Individual Student Performance</h2>
                <div className="flex flex-wrap gap-2">
                    {classData && classData.studentAverages.map(student => (
                        <button key={student.studentId} onClick={() => setSelectedStudent(student)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                            {student.studentName}
                        </button>
                    ))}
                </div>
                {selectedStudent && studentChartData && (
                     <div className="mt-4">
                        <h3 className="text-lg font-semibold">Score trend for {selectedStudent.studentName}</h3>
                        <AnalyticsChart type="line" data={studentChartData} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherAnalytics; 
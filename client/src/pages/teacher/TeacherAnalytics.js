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
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-800 text-center">Class Test Analytics</h1>
            {classData && (
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Class Average vs Student Averages</h2>
                    <div className="w-full min-h-[320px] flex items-center justify-center">
                        <AnalyticsChart 
                            type="bar" 
                            data={barChartData} 
                            height={350}
                            options={{
                                plugins: {
                                    legend: { position: 'bottom', labels: { font: { size: 16 } } },
                                },
                                layout: { padding: 24 },
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 0, font: { size: 14 } } },
                                    y: { ticks: { font: { size: 14 } } }
                                }
                            }}
                        />
                    </div>
                </div>
            )}
            
            <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Individual Student Performance</h2>
                <div className="flex flex-wrap gap-3 justify-center mb-4">
                    {classData && classData.studentAverages.map(student => (
                        <button key={student.studentId} onClick={() => setSelectedStudent(student)}
                            className={`px-5 py-2 rounded-lg font-semibold border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm
                                ${selectedStudent && selectedStudent.studentId === student.studentId
                                    ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                                    : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-100'}`}
                            aria-pressed={selectedStudent && selectedStudent.studentId === student.studentId}
                        >
                            {student.studentName}
                        </button>
                    ))}
                </div>
                {selectedStudent && studentChartData && (
                    <div className="mt-6 w-full min-h-[280px] flex flex-col items-center">
                        <h3 className="text-lg font-semibold mb-2 text-sky-300">Score trend for <span className="text-sky-600">{selectedStudent.studentName}</span></h3>
                        <div className="w-full">
                            <AnalyticsChart
                                type="line"
                                data={studentChartData}
                                height={340}
                                options={{
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: { font: { size: 15 }, color: '#0ea5e9' }
                                        },
                                        tooltip: {
                                            backgroundColor: '#0ea5e9',
                                            titleColor: '#fff',
                                            bodyColor: '#fff',
                                            borderColor: '#38bdf8',
                                            borderWidth: 1,
                                            padding: 12,
                                            cornerRadius: 8,
                                        }
                                    },
                                    elements: {
                                        line: {
                                            tension: 0,
                                            borderWidth: 2,
                                            borderColor: '#0ea5e9',
                                            fill: 'start',
                                            backgroundColor: (context) => {
                                                const chart = context.chart;
                                                const {ctx, chartArea} = chart;
                                                if (!chartArea) return null;
                                                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                                gradient.addColorStop(0, 'rgba(14,165,233,0.18)');
                                                gradient.addColorStop(1, 'rgba(14,165,233,0)');
                                                return gradient;
                                            },
                                            hoverBorderColor: '#38bdf8',
                                            hoverBorderWidth: 5,
                                        },
                                        point: {
                                            radius: studentChartData.labels && studentChartData.labels.length > 25 ? 0 : 5,
                                            backgroundColor: '#fff',
                                            borderColor: '#0ea5e9',
                                            borderWidth: 2,
                                            hoverRadius: 5,
                                            hoverBackgroundColor: '#0ea5e9',
                                            hoverBorderColor: '#0ea5e9',
                                            hoverBorderWidth: 5,
                                            pointStyle: 'circle',
                                        }
                                    },
                                    layout: { padding: 20 },
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    interaction: {
                                        mode: 'nearest',
                                        intersect: false,
                                    },
                                    scales: {
                                        x: {
                                            ticks: {
                                                font: { size: 13 },
                                                color: 'black',
                                                autoSkip: true,
                                                maxRotation: 30,
                                                minRotation: 0,
                                                maxTicksLimit: 12,
                                            },
                                            grid: { color: 'rgba(14,165,233,0.08)' }
                                        },
                                        y: {
                                            ticks: { font: { size: 13 }, color: 'black' },
                                            grid: { color: 'rgba(14,165,233,0.08)' }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherAnalytics; 
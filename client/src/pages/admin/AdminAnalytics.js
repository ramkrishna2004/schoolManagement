import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import AnalyticsChart from '../../components/AnalyticsChart';


const GRADE_TABLE = [
  { grade: 'A', range: '90-100%', color: 'bg-emerald-100 text-emerald-700' },
  { grade: 'B', range: '80-89%', color: 'bg-blue-100 text-blue-700' },
  { grade: 'C', range: '70-79%', color: 'bg-yellow-100 text-yellow-700' },
  { grade: 'D', range: '60-69%', color: 'bg-orange-100 text-orange-700' },
  { grade: 'F', range: 'Below 60%', color: 'bg-red-100 text-red-700' },
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 100,
      title: { display: true, text: 'Score (%)' },
    },
  },
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

const getDefaultAcademicYear = () => {
  const now = new Date();
  const year = now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1;
  return {
    start: `${year}-06-01`,
    end: `${year + 1}-05-31`,
    label: `${year}-${year + 1}`
  };
};

const AdminAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [classTrend, setClassTrend] = useState(null);
    const [classTrendLoading, setClassTrendLoading] = useState(false);
    const [classTrendError, setClassTrendError] = useState(null);
    const [selectedClassStudent, setSelectedClassStudent] = useState(null);
    const [selectedClassStudentTrend, setSelectedClassStudentTrend] = useState(null);
    const [expandedClass, setExpandedClass] = useState(null);
    const [selectedGradeIdx, setSelectedGradeIdx] = useState(null);
    const [yearInput, setYearInput] = useState(getDefaultAcademicYear().label);
    const [yearError, setYearError] = useState('');
    const [filterRange, setFilterRange] = useState({ start: getDefaultAcademicYear().start, end: getDefaultAcademicYear().end });

    useEffect(() => {
        if (!filterRange) return;
        setLoading(true);
        console.log('Requesting analytics for:', filterRange); // Debug: check filter range
        const fetchAllAnalytics = async () => {
            try {
                const data = await analyticsService.getAllAnalytics({
                  startDate: filterRange.start,
                  endDate: filterRange.end
                });
                setAnalyticsData(data);
            } catch (err) {
                setError('Failed to fetch analytics data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllAnalytics();
    }, [filterRange]);

    useEffect(() => {
      if (!expandedClass) return;
      setClassTrendLoading(true);
      setClassTrendError(null);
      setClassTrend(null);
      setSelectedClassStudent(null);
      setSelectedClassStudentTrend(null);
      
      analyticsService.getClassAnalytics(expandedClass.classId || expandedClass._id)
        .then(data => setClassTrend(data))
        .catch(() => setClassTrendError('Failed to fetch class analytics.'))
        .finally(() => setClassTrendLoading(false));
    }, [expandedClass]);

    useEffect(() => {
      if (!selectedClassStudent) return;
      setSelectedClassStudentTrend(null);
      analyticsService.getStudentAnalyticsById(selectedClassStudent.studentId)
        .then(data => setSelectedClassStudentTrend(data))
        .catch(() => setSelectedClassStudentTrend(null));
    }, [selectedClassStudent]);

    const handleYearFilter = () => {
      setYearError('');
      const match = yearInput.match(/^(\d{4})\s*-\s*(\d{4})$/);
      if (!match) {
        setYearError('Please enter a valid year range, e.g. 2025-2026');
        return;
      }
      const startYear = parseInt(match[1], 10);
      const endYear = parseInt(match[2], 10);
      if (endYear !== startYear + 1) {
        setYearError('End year must be exactly one more than start year.');
        return;
      }
      setFilterRange({
        start: `${startYear}-06-01`,
        end: `${endYear}-05-31`
      });
    };

    if (loading) return <LoadingSpinner />;
    
    if (error) return (
      <div className="max-w-2xl mx-auto p-4">
        <Card className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </Card>
      </div>
    );

    if (!loading && analyticsData && analyticsData.scoreDistribution && analyticsData.scoreDistribution.every(g => g.count === 0)) {
      return (
        <div className="text-center text-gray-500 mt-8">
          No data found for the selected academic year.
        </div>
      );
    }

    const pieChartData = analyticsData ? {
        labels: analyticsData.scoreDistribution.map(d => d._id),
        datasets: [{
            data: analyticsData.scoreDistribution.map(d => d.count),
            backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280'],
        }]
    } : null;

    const barChartData = analyticsData ? {
        labels: analyticsData.classAverages.map(c => c.className),
        datasets: [{
            label: 'Class Average Scores',
            data: analyticsData.classAverages.map(c => c.averageScore),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
        }]
    } : null;

    const teacherTrendTable = analyticsData && analyticsData.classAverages ? (
      <Card className="mt-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Class Performance Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Class Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Average Score</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analyticsData.classAverages.map((c) => (
                <React.Fragment key={c.className}>
                  <tr className={`transition-colors duration-200 ${
                    expandedClass && expandedClass.className === c.className 
                      ? 'bg-blue-50 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{c.className}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {c.averageScore ? (
                        <span className="font-mono text-lg">{c.averageScore.toFixed(1)}%</span>
                      ) : (
                        <span className="text-gray-400">No data</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                          expandedClass && expandedClass.className === c.className 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setExpandedClass(
                          expandedClass && expandedClass.className === c.className ? null : c
                        )}
                      >
                        {expandedClass && expandedClass.className === c.className ? 'Hide Details' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedClass && expandedClass.className === c.className && (
                    <tr>
                      <td colSpan={3} className="px-0 py-0">
                        <div className="bg-gray-50 border-t border-gray-200">
                          <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                              Detailed Analytics: {expandedClass.className}
                            </h3>
                            
                            {classTrendLoading && (
                              <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-gray-600">Loading class analytics...</span>
                              </div>
                            )}
                            
                            {classTrendError && (
                              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                                <div className="text-red-700">{classTrendError}</div>
                              </div>
                            )}
                            
                            {classTrend && (
                              <div className="space-y-6">
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                  <h4 className="font-semibold mb-3 text-gray-800">Student Performance Distribution</h4>
                                  <div className="h-80">
                                    <AnalyticsChart
                                      type="bar"
                                      data={{
                                        labels: classTrend.studentAverages.map(s => s.studentName),
                                        datasets: [
                                          {
                                            label: 'Student Average',
                                            data: classTrend.studentAverages.map(s => s.averageScore),
                                            backgroundColor: 'rgba(59, 130, 246, 0.6)',
                                            borderColor: 'rgba(59, 130, 246, 1)',
                                            borderWidth: 1,
                                          },
                                          {
                                            label: 'Class Average',
                                            data: Array(classTrend.studentAverages.length).fill(classTrend.classAverage),
                                            type: 'line',
                                            borderColor: 'rgba(239, 68, 68, 1)',
                                            borderWidth: 2,
                                            fill: false,
                                            pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                                          },
                                        ],
                                      }}
                                      options={chartOptions}
                                    />
                                  </div>
                                </div>
                                
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                  <h4 className="font-semibold mb-3 text-gray-800">Individual Student Trends</h4>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {classTrend.studentAverages.map(student => (
                                      <button
                                        key={student.studentId}
                                        onClick={() => setSelectedClassStudent(student)}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                          selectedClassStudent && selectedClassStudent.studentId === student.studentId
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                      >
                                        {student.studentName}
                                      </button>
                                    ))}
                                  </div>
                                  
                                  {selectedClassStudent && selectedClassStudentTrend && (
                                    <div className="mt-4">
                                      <h5 className="font-medium mb-2 text-gray-800">
                                        Score Trend: {selectedClassStudent.studentName}
                                      </h5>
                                      <div className="w-full overflow-x-auto">
                                        <div
                                          style={{
                                            width: Math.max(600, selectedClassStudentTrend.labels.length * 80),
                                            height: 340,
                                          }}
                                        >
                                          <AnalyticsChart
                                            type="line"
                                            data={selectedClassStudentTrend}
                                            options={{
                                              responsive: false,
                                              maintainAspectRatio: false,
                                              plugins: {
                                                legend: {
                                                  position: 'top',
                                                  labels: { font: { size: 15 }, color: '#0ea5e9' }
                                                },
                                                title: {
                                                  display: false
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
                                                  radius: selectedClassStudentTrend.labels && selectedClassStudentTrend.labels.length > 25 ? 0 : 5,
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
                                            width={Math.max(600, selectedClassStudentTrend.labels.length * 80)}
                                            height={340}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    ) : null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive test performance analytics</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full mb-8">
                <label htmlFor="academic-year" className="font-medium text-gray-700 sm:mb-0 mb-1">Academic Year:</label>
                <input
                  id="academic-year"
                  type="text"
                  className="w-full sm:w-auto min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base bg-white"
                  placeholder="2025-2026 (June 1st to May 31st)"
                  value={yearInput}
                  onChange={e => setYearInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleYearFilter(); }}
                />
                <button
                  className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  onClick={handleYearFilter}
                >
                  Filter
                </button>
              </div>
            </div>
            {yearError && (
              <div className="mb-4 text-red-600 font-medium text-center">{yearError}</div>
            )}

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {analyticsData && (
                    <>
                        <Card>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Score Distribution</h2>
                            <div className="h-80">
                              <AnalyticsChart
                                type="pie"
                                data={pieChartData}
                                options={chartOptions}
                                onElementClick={setSelectedGradeIdx}
                              />
                            </div>
                            {selectedGradeIdx !== null && analyticsData.scoreDistribution[selectedGradeIdx] && (
                              <div className="mt-8">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    Students with {analyticsData.scoreDistribution[selectedGradeIdx]._id}
                                  </h3>
                                  <button
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
                                    onClick={() => setSelectedGradeIdx(null)}
                                  >
                                    Close
                                  </button>
                                </div>
                                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                                  <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Roll No</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Class</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {analyticsData.scoreDistribution[selectedGradeIdx].students.length === 0 ? (
                                        <tr>
                                          <td colSpan={3} className="px-4 py-6 text-center text-gray-500">No students in this grade.</td>
                                        </tr>
                                      ) : (
                                        analyticsData.scoreDistribution[selectedGradeIdx].students.map((student, idx) => (
                                          <tr key={idx} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                                            <td className="px-4 py-3 text-gray-700">{student.rollno}</td>
                                            <td className="px-4 py-3 text-gray-700">{student.class}</td>
                                          </tr>
                                        ))
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                        </div>
                            )}
                        </Card>
                        <Card>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Class Performance Comparison</h2>
                            <div className="h-80">
                              <AnalyticsChart type="bar" data={barChartData} options={chartOptions} />
                        </div>
                        </Card>
                    </>
                )}
            </div>

            {/* Grade Reference Table */}
            <Card className="max-w-md mx-auto mb-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Grading Scale</h2>
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  Score = (Marks Obtained / Total Marks) × 100
                </span>
              </div>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Grade</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Score Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {GRADE_TABLE.map(row => (
                      <tr key={row.grade}>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.color}`}>
                            {row.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{row.range}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Class Performance Table */}
            {teacherTrendTable}
          </div>
        </div>
    );
};

export default AdminAnalytics; 
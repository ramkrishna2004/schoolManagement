import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import AnalyticsChart from '../../components/AnalyticsChart';
import { useAuth } from '../../contexts/AuthContext';

const StudentAnalytics = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await analyticsService.getStudentAnalytics();
                setChartData(data);
            } catch (err) {
                setError('Failed to fetch analytics data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p>Loading analytics...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Test Analytics</h1>
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">My Score Trend</h2>
                <div className="w-full overflow-x-auto">
                    {chartData && (
                        <div
                            style={{
                                width: Math.max(600, chartData.labels.length * 80),
                                height: 340,
                            }}
                        >
                            <AnalyticsChart
                                type="line"
                                data={chartData}
                                options={{
                                    responsive: false,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                            labels: { font: { size: 15 }, color: '#0ea5e9' }
                                        },
                                        title: {
                                            display: true,
                                            text: `Showing score trend for ${user.name}`,
                                            color: '#0ea5e9',
                                            font: { size: 18, weight: 'bold' }
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
                                            radius: chartData.labels && chartData.labels.length > 25 ? 0 : 5,
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
                                width={Math.max(600, chartData.labels.length * 80)}
                                height={340}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAnalytics; 
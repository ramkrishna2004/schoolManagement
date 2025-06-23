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
                {chartData && (
                    <AnalyticsChart
                        type="line"
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: `Showing score trend for ${user.name}`,
                                },
                            },
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default StudentAnalytics; 
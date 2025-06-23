import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import AnalyticsChart from '../../components/AnalyticsChart';

const AdminAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllAnalytics = async () => {
            try {
                const data = await analyticsService.getAllAnalytics();
                setAnalyticsData(data);
            } catch (err) {
                setError('Failed to fetch analytics data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllAnalytics();
    }, []);

    if (loading) return <p>Loading analytics...</p>;
    if (error) return <p>{error}</p>;

    const pieChartData = analyticsData ? {
        labels: analyticsData.scoreDistribution.map(d => d._id),
        datasets: [{
            data: analyticsData.scoreDistribution.map(d => d.count),
            backgroundColor: ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'],
        }]
    } : null;

    const barChartData = analyticsData ? {
        labels: analyticsData.classAverages.map(c => c.className),
        datasets: [{
            label: 'Class Average Scores',
            data: analyticsData.classAverages.map(c => c.averageScore),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }]
    } : null;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Overall Test Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analyticsData && (
                    <>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-2">Score Distribution Across All Classes</h2>
                            <AnalyticsChart type="pie" data={pieChartData} />
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-2">Average Scores by Class</h2>
                            <AnalyticsChart type="bar" data={barChartData} />
                        </div>
                    </>
                )}
            </div>
            {/* TODO: Add student search and individual trend view for admins */}
        </div>
    );
};

export default AdminAnalytics; 
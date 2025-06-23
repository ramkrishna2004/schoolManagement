import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AnalyticsChart = ({ type, data, options }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type,
            data,
            options,
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [type, data, options]);

    return <canvas ref={chartRef}></canvas>;
};

export default AnalyticsChart; 
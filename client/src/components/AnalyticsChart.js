import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AnalyticsChart = ({ type, data, options, onElementClick }) => {
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

        // Add click handler for pie chart
        if (type === 'pie' && onElementClick) {
            const canvas = chartRef.current;
            const handler = (event) => {
                const points = chartInstance.current.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
                if (points.length > 0) {
                    const idx = points[0].index;
                    onElementClick(idx);
                }
            };
            canvas.addEventListener('click', handler);
            return () => {
                canvas.removeEventListener('click', handler);
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }
            };
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [type, data, options, onElementClick]);

    return <canvas ref={chartRef}></canvas>;
};

export default AnalyticsChart; 
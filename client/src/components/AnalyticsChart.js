import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AnalyticsChart = ({ type, data, options, onElementClick, width, height }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const dpr = window.devicePixelRatio || 1;

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const canvas = chartRef.current;
        // Set actual pixel buffer size for high-DPI
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        // Set CSS size
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        // Scale context
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        chartInstance.current = new Chart(ctx, {
            type,
            data,
            options,
        });

        // Add click handler for pie chart
        if (type === 'pie' && onElementClick) {
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
    }, [type, data, options, onElementClick, width, height, dpr]);

    return (
        <canvas
            ref={chartRef}
            style={{ display: 'block' }}
        ></canvas>
    );
};

export default AnalyticsChart; 
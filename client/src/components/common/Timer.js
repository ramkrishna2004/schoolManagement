import React, { useState, useEffect } from 'react';

const Timer = ({ targetDate, onExpire, prefix }) => {
  const calculateTimeLeft = () => {
    const target = new Date(targetDate);
    if (isNaN(target.getTime())) {
        return {}; // Invalid date
    }
    const difference = +target - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!targetDate) return;

    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (!Object.keys(newTimeLeft).length) {
        if(onExpire) onExpire();
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && ['days', 'hours'].includes(interval) ) {
      return;
    }
     if (timeLeft[interval] || interval === 'seconds' || interval === 'minutes') {
        let value = timeLeft[interval];
        if (interval === 'minutes' || interval === 'seconds') {
            value = String(value).padStart(2, '0');
        }
        timerComponents.push(
            <span key={interval} className="font-mono">
                {value}{interval.charAt(0)}
            </span>
        );
     }
  });

  return (
    <div>
      {prefix && <span className="mr-2">{prefix}</span>}
      {timerComponents.length ? (
        <div className="inline-flex items-center space-x-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {timerComponents.reduce((prev, curr) => [prev, <span key={Math.random()}>:</span>, curr])}
        </div>
      ) : (
        <span className="text-sm font-medium text-red-600">Time&apos;s up!</span>
      )}
    </div>
  );
};

export default Timer; 
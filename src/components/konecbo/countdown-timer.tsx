'use client';

import { useEffect, useState } from 'react';

// Set a target launch date in the future
const LAUNCH_DATE = new Date('2026-02-17T00:00:00Z');

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +LAUNCH_DATE - +new Date();
      let newTimeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return newTimeLeft;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft?.days },
    { label: 'Hours', value: timeLeft?.hours },
    { label: 'Minutes', value: timeLeft?.minutes },
    { label: 'Seconds', value: timeLeft?.seconds },
  ];

  return (
    <div className="mt-4">
      <h3 className="font-headline text-lg font-medium text-primary mb-4">
        Launching In:
      </h3>
      <div className="grid grid-flow-col gap-4 text-center auto-cols-max">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col p-4 bg-secondary/70 rounded-lg w-20 md:w-24"
          >
            <span className="text-primary font-mono text-4xl md:text-5xl font-bold">
              {unit.value !== null && unit.value !== undefined
                ? String(unit.value).padStart(2, '0')
                : '00'}
            </span>
            <span className="text-primary/80 text-xs uppercase tracking-wider">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

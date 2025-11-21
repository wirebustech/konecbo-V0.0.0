'use client';

import { useState, useEffect } from 'react';

const STARTING_COUNT = 2;

export function RegistrationCount() {
  const [count, setCount] = useState(STARTING_COUNT);

  useEffect(() => {
    const randomInterval = Math.random() * 10000 + 20000; // between 10-20 seconds

    const timer = setTimeout(() => {
      setCount((prevCount: number) => prevCount + 1);
    }, randomInterval);

    return () => clearTimeout(timer);
  }, [count]);

  return (
    <span className="font-bold text-accent transition-all duration-300">
      {count.toLocaleString()}
    </span>
  );
}

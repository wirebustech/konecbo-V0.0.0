'use client';

import { useState, useEffect } from 'react';
import { getWaitlistCount } from '@/app/actions';

export function RegistrationCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      const fetchedCount = await getWaitlistCount();
      setCount(fetchedCount);
    }

    fetchCount();

    // Optional: Refresh the count periodically
    const interval = setInterval(fetchCount, 60000); // every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-bold text-accent transition-all duration-300">
      {count !== null ? count.toLocaleString() : 'Loading...'}
    </span>
  );
}

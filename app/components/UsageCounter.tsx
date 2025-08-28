'use client';

import { useState, useEffect } from 'react';

export default function UsageCounter() {
  const [count, setCount] = useState(0);
  const targetCount = 500; // Audits run this month

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetCount / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setCount(targetCount);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-8 bg-gray-50" data-testid="usage-counter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {count.toLocaleString()}+
          </div>
          <div className="text-lg text-gray-600">
            Amazon audits completed this month
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Join thousands of sellers optimizing their listings
          </div>
        </div>
      </div>
    </section>
  );
}

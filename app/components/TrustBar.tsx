'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TrustBar() {
  const [count, setCount] = useState(0);
  const targetCount = 500; // TODO: replace with real audit count

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
    <section className="py-8 bg-white border-b border-gray-100" data-testid="trustbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Usage Counter */}
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {count.toLocaleString()}+
          </div>
          <div className="text-sm text-gray-600">
            Amazon audits completed this month
          </div>
        </div>

        {/* Trust Caption */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            Trusted by sellers in 10+ countries
          </p>
          {/* TODO: update with real country count and client-provided trust statement */}
        </div>

        {/* Logo Placeholders */}
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {/* TODO: Replace with actual client logos */}
          <div className="flex items-center justify-center w-24 h-12 bg-gray-200 rounded">
            <span className="text-xs text-gray-500">Logo 1</span>
          </div>
          <div className="flex items-center justify-center w-24 h-12 bg-gray-200 rounded">
            <span className="text-xs text-gray-500">Logo 2</span>
          </div>
          <div className="flex items-center justify-center w-24 h-12 bg-gray-200 rounded">
            <span className="text-xs text-gray-500">Logo 3</span>
          </div>
          <div className="flex items-center justify-center w-24 h-12 bg-gray-200 rounded">
            <span className="text-xs text-gray-500">Logo 4</span>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6 text-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xs font-semibold">✓</span>
            </div>
            <span className="text-sm text-gray-600">Secure & private</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-semibold">⚡</span>
            </div>
            <span className="text-sm text-gray-600">Instant results</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xs font-semibold">💯</span>
            </div>
            <span className="text-sm text-gray-600">100% free forever</span>
          </div>
        </div>
      </div>
    </section>
  );
}

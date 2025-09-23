'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TrustBar() {
  const [count, setCount] = useState(0);
  const targetCount = 250; // Current audit count

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
    <section className="py-8 md:py-20" data-testid="trustbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Usage Counter */}
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-white mb-2">
            {count.toLocaleString()}+
          </div>
          <div className="text-sm text-white/70">
            Amazon audits completed this month
          </div>
        </div>

        {/* Expert Credentials - CRO Optimized */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition p-6 md:p-8 mb-6">
          <div className="text-center">
            <div className="text-center mb-3">
              <h3 className="text-xl md:text-2xl font-semibold text-white">Meet Your Amazon Expert</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition p-3">
                <div className="font-semibold text-[#FF6B00]">4+ Years</div>
                <div className="text-white/80">Amazon Marketplace</div>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition p-3">
                <div className="font-semibold text-[#FF6B00]">$1.1M</div>
                <div className="text-white/80">New Product Launches</div>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition p-3">
                <div className="font-semibold text-[#FF6B00]">$5.5M</div>
                <div className="text-white/80">Active Portfolio</div>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition p-3">
                <div className="font-semibold text-[#FF6B00]">Breakthrough</div>
                <div className="text-white/80">Sales Results</div>
              </div>
            </div>
            <p className="text-xs text-white/60 mt-3">
              Former Amazon employee specializing in seller growth & optimization
            </p>
          </div>
        </div>

        {/* Trust Caption */}
        <div className="text-center mb-6">
          <p className="text-sm text-white/70">
            Trusted by sellers in 10+ countries
          </p>
        </div>

        {/* Logo Placeholders */}
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded border border-white/10">
            <span className="text-xs text-white/60">Logo 1</span>
          </div>
          <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded border border-white/10">
            <span className="text-xs text-white/60">Logo 2</span>
          </div>
          <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded border border-white/10">
            <span className="text-xs text-white/60">Logo 3</span>
          </div>
          <div className="flex items-center justify-center w-24 h-12 bg-white/5 rounded border border-white/10">
            <span className="text-xs text-white/60">Logo 4</span>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6 text-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-xs font-semibold">✓</span>
            </div>
            <span className="text-sm text-white/80">Secure & private</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#007AFF]/20 rounded-full flex items-center justify-center">
              <span className="text-[#007AFF] text-xs font-semibold">•</span>
            </div>
            <span className="text-sm text-white/80">Instant results</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF6B00]/20 rounded-full flex items-center justify-center">
              <span className="text-[#FF6B00] text-xs font-semibold">•</span>
            </div>
            <span className="text-sm text-white/80">100% free forever</span>
          </div>
        </div>
      </div>
    </section>
  );
}

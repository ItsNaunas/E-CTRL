'use client';

import { useState } from 'react';
import CTAButton from './CTAButton';

interface HeroProps {
  onAsinSubmit: (asin: string) => void;
}

export default function Hero({ onAsinSubmit }: HeroProps) {
  const [asinInput, setAsinInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (asinInput.trim()) {
      onAsinSubmit(asinInput.trim());
    }
  };

  return (
    <section className="bg-background py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Free AI Audit of Your Amazon Listing — Boost Sales in Minutes
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Enter your ASIN or product link to get instant insights. No credit card required.
            </p>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="asin-input" className="sr-only">
                  Amazon ASIN or Product URL
                </label>
                <input
                  id="asin-input"
                  type="text"
                  value={asinInput}
                  onChange={(e) => setAsinInput(e.target.value)}
                  placeholder="Enter your Amazon ASIN or product URL"
                  className="block w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder-muted-foreground transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 sm:text-lg"
                  required
                  aria-describedby="asin-help"
                />
              </div>
              
              <CTAButton
                type="submit"
                variant="primary"
                size="lg"
                text="audit"
                fullWidth
                className="w-full"
              />
              
              <p id="asin-help" className="text-sm text-muted-foreground text-center">
                Instant results. 100% free. Secure & private.
              </p>
            </form>
          </div>
          
          {/* Right Column - Realistic Audit Preview */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              {/* Report Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg">Amazon Listing Audit Report</h3>
                  <div className="text-white text-sm">Score: 74/100</div>
                </div>
              </div>
              
              {/* Report Content */}
              <div className="p-6 space-y-4">
                {/* Score Section */}
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">74/100</div>
                  <div className="text-sm text-gray-600">Overall Listing Score</div>
                </div>
                
                {/* Key Findings */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Findings:</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">⚠️</span>
                      <span className="text-sm text-gray-700">Bullet clarity needs improvement</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✅</span>
                      <span className="text-sm text-gray-700">Image size meets requirements</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">💡</span>
                      <span className="text-sm text-gray-700">Keyword gap: 'eco friendly' missing</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Items */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Quick Wins:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Add missing keywords to title</li>
                    <li>• Improve bullet point clarity</li>
                    <li>• Optimize image background</li>
                  </ul>
                </div>
              </div>
              
              {/* Watermark */}
              <div className="absolute top-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
                Sample Report
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

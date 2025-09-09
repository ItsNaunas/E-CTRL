'use client';

import { useState } from 'react';
import Image from 'next/image';
import CTAButton from '@/components/CTAButton';
import { parseAsinOrUrl } from '@/app/utils/validators';

interface HeroProps {
  onAsinSubmit: (asin: string) => void;
}

export default function Hero({ onAsinSubmit }: HeroProps) {
  const [asinInput, setAsinInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const validation = parseAsinOrUrl(asinInput);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      setIsSubmitting(false);
      return;
    }

    // Track audit start
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'audit_start', {
        event_category: 'engagement',
        event_label: 'hero_form'
      });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onAsinSubmit(validation.parsedValue!);
    setIsSubmitting(false);
  };

  return (
    <section className="relative py-16 md:py-20 after:content-[''] after:absolute after:inset-0 after:-z-10 after:bg-[radial-gradient(60%_40%_at_50%_0%,rgba(0,122,255,0.25),transparent_60%)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-[#007AFF] to-[#FF6B00] bg-clip-text text-transparent">
              Free AI Audit of Your Amazon Listing — Boost Sales in Minutes
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl">
              Enter your ASIN or product link. Get a basic audit via email. Create an account anytime for the full report.
            </p>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="asin-input" className="sr-only">
                  Amazon ASIN or Product URL
                </label>
                <input
                  id="asin-input"
                  data-testid="hero-input"
                  type="text"
                  value={asinInput}
                  onChange={(e) => {
                    setAsinInput(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your Amazon ASIN or product URL"
                  className={`block w-full rounded-xl bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-[#007AFF]/50 focus:ring-2 focus:ring-[#007AFF]/30 px-4 py-3 transition outline-none sm:text-lg ${
                    error 
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' 
                      : ''
                  }`}
                  required
                  aria-describedby={error ? "asin-error" : "asin-help"}
                  aria-invalid={!!error}
                />
                {error && (
                  <p id="asin-error" className="mt-2 text-sm text-red-400" role="alert">
                    {error}
                  </p>
                )}
              </div>
              
              <CTAButton
                type="submit"
                variant="primary"
                size="lg"
                text="audit my listing now"
                fullWidth
                className="w-full"
                disabled={isSubmitting}
                data-testid="hero-cta"
              />
              
              <p id="asin-help" className="text-sm text-white/70 text-center" data-testid="microcopy-free">
                Instant results. 100% free. Secure & private.
              </p>
            </form>
          </div>
          
          {/* Right Column - Tablet Mockup */}
          <div className="relative flex justify-center items-center">
            {/* Tablet Device Frame */}
            <div className="relative animate-fade-in-up">
              {/* Tablet Body */}
              <div className="relative w-80 h-96 bg-gray-800 rounded-3xl p-2 shadow-2xl">
                {/* Screen Bezel */}
                <div className="w-full h-full bg-black rounded-2xl overflow-hidden relative">
                  {/* Screen Content */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 relative">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-4 py-2 text-white text-xs">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* App Header */}
                    <div className="bg-gradient-to-r from-[#007AFF] to-[#FF6B00] px-4 py-3">
                      <h3 className="text-white font-semibold text-sm">Amazon Audit Report</h3>
                    </div>
                    
                    {/* Report Content */}
                    <div className="p-4 space-y-3">
                      {/* Score Display */}
                      <div className="text-center py-2">
                        <div className="text-2xl font-bold bg-gradient-to-r from-[#007AFF] to-[#FF6B00] bg-clip-text text-transparent">74/100</div>
                        <div className="text-xs text-white/70">Overall Score</div>
                      </div>
                      
                      {/* Key Findings */}
                      <div>
                        <h4 className="font-semibold text-white text-xs mb-2">Key Findings:</h4>
                        <div className="space-y-1">
                          <div className="flex items-start gap-1">
                            <span className="text-red-400 text-xs mt-0.5">⚠️</span>
                            <span className="text-xs text-white/80">Bullet clarity needs improvement</span>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-green-400 text-xs mt-0.5">✅</span>
                            <span className="text-xs text-white/80">Image size meets requirements</span>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-orange-400 text-xs mt-0.5">💡</span>
                            <span className="text-xs text-white/80">Keyword gap: &apos;eco friendly&apos; missing</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Wins */}
                      <div className="bg-white/5 rounded p-2">
                        <h4 className="font-semibold text-white text-xs mb-1">Quick Wins:</h4>
                        <ul className="text-xs text-white/80 space-y-0.5">
                          <li>• Add missing keywords to title</li>
                          <li>• Improve bullet point clarity</li>
                          <li>• Optimize image background</li>
                        </ul>
                      </div>
                    </div>
                    
                    {/* Blur Overlay */}
                    <div className="absolute inset-0 bg-[#0D0D0D]/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl mb-1">🔍</div>
                        <p className="text-white font-medium text-xs">Enter your ASIN to see your audit</p>
                        <p className="text-xs text-white/70 mt-0.5">Sample report preview</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Home Button */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-600"></div>
              </div>
              
              {/* Tablet Shadow */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-72 h-8 bg-black/20 rounded-full blur-xl"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-[#007AFF] to-[#FF6B00] rounded-full animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-6 h-6 bg-gradient-to-r from-[#FF6B00] to-[#007AFF] rounded-full animate-pulse delay-1000"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
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
          
          {/* Right Column - Blurred Preview */}
          <div className="relative">
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition overflow-hidden">
              {/* Blurred Report Preview */}
              <div className="relative">
                <div className="bg-gradient-to-r from-[#007AFF] to-[#FF6B00] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg">Amazon Listing Audit Report</h3>
                    <div className="text-white text-sm">Score: 74/100</div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold bg-gradient-to-r from-[#007AFF] to-[#FF6B00] bg-clip-text text-transparent mb-2">74/100</div>
                    <div className="text-sm text-white/70">Overall Listing Score</div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">Key Findings:</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">⚠️</span>
                        <span className="text-sm text-white/80">Bullet clarity needs improvement</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✅</span>
                        <span className="text-sm text-white/80">Image size meets requirements</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-orange-400 mt-1">💡</span>
                        <span className="text-sm text-white/80">Keyword gap: &apos;eco friendly&apos; missing</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Quick Wins:</h4>
                    <ul className="text-sm text-white/80 space-y-1">
                      <li>• Add missing keywords to title</li>
                      <li>• Improve bullet point clarity</li>
                      <li>• Optimize image background</li>
                    </ul>
                  </div>
                </div>
                
                {/* Blur Overlay */}
                <div className="absolute inset-0 bg-[#0D0D0D]/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔍</div>
                    <p className="text-white font-medium">Enter your ASIN to see your audit</p>
                    <p className="text-sm text-white/70 mt-1">Sample report preview</p>
                  </div>
                </div>
              </div>
              
              {/* Watermark */}
              <div className="absolute top-2 right-2 text-xs text-white/60 bg-[#0D0D0D]/80 px-2 py-1 rounded">
                Sample Report
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

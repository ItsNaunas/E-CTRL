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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-[#007AFF] to-[#FF6B00] bg-clip-text text-transparent">
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
          
          {/* Right Column - iPad Mockup */}
          <div className="relative flex justify-center items-center">
            {/* iPad Mockup Image */}
            <div className="relative animate-fade-in-up">
              <img 
                src="/ipad-mockup.png" 
                alt="iPad showing Amazon audit report" 
                className="w-80 h-96 object-contain transform scale-x-[-1]"
              />
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-[#007AFF] to-[#FF6B00] rounded-full animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-6 h-6 bg-gradient-to-r from-[#FF6B00] to-[#007AFF] rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

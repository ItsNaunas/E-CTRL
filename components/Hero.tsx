'use client';

import { useState } from 'react';
import Image from 'next/image';
import UnifiedCTA from '@/components/UnifiedCTA';
import ClientTestimonials from '@/components/ClientTestimonials';
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
    <section className="relative min-h-[92vh] bg-gradient-to-br from-[#0a0b1a] via-[#0f1020] to-[#1a0c00] text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-gradient-to-br from-[#296AFF] to-[#1e3a8a] rounded-full blur-3xl opacity-25"></div>
      <div className="absolute bottom-0 right-0 w-[70vw] h-[70vw] bg-gradient-to-tl from-[#FF7D2B] to-[#dc2626] rounded-full blur-3xl opacity-25"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-gradient-to-r from-[#296AFF]/10 to-[#FF7D2B]/10 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(41,106,255,0.15)_0%,rgba(255,125,43,0.15)_50%,transparent_70%)]"></div>
      
      <div className="relative mx-auto w-full max-w-[1320px] px-6 py-6 md:py-20">
        <div className="grid items-center gap-8 lg:gap-16 lg:grid-cols-2">
          
          {/* Left: Content */}
          <div>
            {/* Headlines */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-[#296AFF] to-white bg-clip-text text-transparent">
                Free AI Audit
              </span><br/>
              <span className="text-white">of Your Amazon Listing</span><br/>
              <span className="bg-gradient-to-r from-white to-[#FF7D2B] bg-clip-text text-transparent">
                Boost Sales in Minutes
              </span>
            </h1>
            
            <p className="mt-6 max-w-2xl text-white/70 text-base lg:text-lg leading-relaxed">
              Enter your ASIN or product link. Get a comprehensive audit report with actionable insights to optimize your listing and increase sales.
            </p>

            {/* Input + CTA */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="text"
                value={asinInput}
                onChange={(e) => {
                  setAsinInput(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter ASIN or product URL"
                className={`block w-full rounded-[45px] bg-white/5 backdrop-blur-sm px-6 py-4 text-base text-white/90 border border-white/20 placeholder:text-white/50 outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 ${
                  error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''
                }`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'asin-error' : 'asin-help'}
                data-testid="hero-input"
              />
              
              <UnifiedCTA
                type="submit"
                variant="primary"
                size="md"
                text="run free audit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full"
                data-testid="hero-cta"
              />
            </form>

            {error && (
              <p id="asin-error" className="mt-4 text-base text-red-400" role="alert" data-testid="error-message">
                {error}
              </p>
            )}
            
            <p className="mt-4 text-base text-white/60 text-center">
              Instant results. 100% free. Secure &amp; private.
            </p>

            {/* Client Testimonials - Social Proof (Mobile only) */}
            <div className="mt-6 md:hidden">
              <div className="text-center mb-3">
                <p className="text-xs text-white/40">
                  Trusted by Amazon sellers worldwide
                </p>
              </div>
              <ClientTestimonials />
            </div>

          </div>

          {/* Right: Mockup Image - Hidden on mobile */}
          <div className="justify-self-end hidden md:block -mr-12 lg:-mr-24">
            <Image
              src="/ipad-mockup.png"
              alt="Amazon Audit Report preview"
              width={1012}
              height={600}
              className="block h-auto w-[1012px] max-w-[95vw]"
              draggable={false}
              priority
            />
          </div>
        </div>

        {/* Client Testimonials - Social Proof (Desktop only - below image) */}
        <div className="hidden md:block mt-8">
          <div className="text-center mb-3">
            <p className="text-xs text-white/40">
              Trusted by Amazon sellers worldwide
            </p>
          </div>
          <ClientTestimonials />
        </div>
      </div>
    </section>
  );
}

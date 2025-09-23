'use client';

import Image from 'next/image';
import UnifiedCTA from './UnifiedCTA';

interface BeforeAfterProofProps {
  onCtaClick?: () => void;
}

export default function BeforeAfterProof({ onCtaClick }: BeforeAfterProofProps) {
  return (
    <section className="relative bg-[#0B0B0C] text-white py-16">
      {/* Background auras */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_20%,#0e132d,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(65%_55%_at_80%_35%,#2a0f03,transparent_60%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          {/* Top chip */}
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
            Real Results
          </span>
          
          {/* Main Headline */}
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-[#296AFF] to-white bg-clip-text text-transparent">
              Case Studies
            </span>
          </h2>
          
          {/* Subtext */}
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            From flat cushions to premium-looking inserts. See the transformation that significantly boosted sales for this Amazon seller
          </p>
        </div>

        {/* Before/After Comparison */}
        <div className="relative">
          {/* Glass container */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 md:p-8">
            
            {/* Desktop: Side by side with arrow in middle */}
            <div className="hidden md:flex md:items-center md:gap-8">
              
              {/* Before */}
              <div className="flex-1 relative group">
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/before-after/before-cushions.jpg"
                    alt="Before: Flat cushion inserts"
                    width={500}
                    height={400}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Before Label */}
                  <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                    BEFORE
                  </div>
                </div>
                
                {/* Before Description */}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Flat, Unappealing</h3>
                  <p className="text-sm text-white/70">
                    Generic product photos that blend into the crowd
                  </p>
                </div>
              </div>

              {/* Arrow (Desktop) */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

              {/* After */}
              <div className="flex-1 relative group">
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/before-after/after-cushions.jpg"
                    alt="After: Premium-looking pillow inserts"
                    width={500}
                    height={400}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* After Label */}
                  <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                    AFTER
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#296AFF]/20 to-[#FF7D2B]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* After Description */}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Premium, Professional</h3>
                  <p className="text-sm text-white/70">
                    Eye-catching photos that command attention and drive sales
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile: Stacked */}
            <div className="md:hidden space-y-6">
              
              {/* Before */}
              <div className="relative group">
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/before-after/before-cushions.jpg"
                    alt="Before: Flat cushion inserts"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                  <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                    BEFORE
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">Flat, Unappealing</h3>
                  <p className="text-sm text-white/70">
                    Generic product photos that blend into the crowd
                  </p>
                </div>
              </div>

              {/* Arrow (Mobile) */}
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* After */}
              <div className="relative group">
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/before-after/after-cushions.jpg"
                    alt="After: Premium-looking pillow inserts"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                  <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                    AFTER
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#296AFF]/20 to-[#FF7D2B]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">Premium, Professional</h3>
                  <p className="text-sm text-white/70">
                    Eye-catching photos that command attention and drive sales
                  </p>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/90">
                <div className="h-2 w-2 rounded-full bg-[#FF7D2B]"></div>
                <span>Result: Significant increase in sales</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <UnifiedCTA
            variant="primary"
            size="md"
            text="Fix my product photos"
            onClick={onCtaClick}
            className="mx-auto"
          />
          <p className="text-xs text-white/60 mt-2">
            Get your transformation in minutes
          </p>
        </div>
      </div>
    </section>
  );
}

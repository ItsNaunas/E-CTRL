'use client';

import Image from 'next/image';
import UnifiedCTA from './UnifiedCTA';

const steps = [
  {
    number: 1,
    title: "Enter ASIN / URL",
    desc: "Paste your product link or ASIN to get started.",
    img: "/steps/step-1-enter-asin.png",
    imgAlt: "URL bar illustration"
  },
  {
    number: 2,
    title: "AI Audit",
    desc: "We score your listing and find keyword, image, or compliance gaps.",
    img: "/steps/step-2-ai-audit.png",
    imgAlt: "AI audit illustration"
  },
  {
    number: 3,
    title: "Instant Report",
    desc: "Download your optimized listing and checklist in minutes.",
    img: "/steps/step-3-instant-report.png",
    imgAlt: "PDF report illustration"
  }
];

interface HowItWorksSectionProps {
  onCtaClick?: () => void;
}

export default function HowItWorksSection({ onCtaClick }: HowItWorksSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-[#0a0b1a] via-[#0f1020] to-[#1a0c00] text-white py-16 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-gradient-to-br from-[#296AFF] to-[#1e3a8a] rounded-full blur-3xl opacity-25"></div>
      <div className="absolute bottom-0 right-0 w-[70vw] h-[70vw] bg-gradient-to-tl from-[#FF7D2B] to-[#dc2626] rounded-full blur-3xl opacity-25"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-gradient-to-r from-[#296AFF]/10 to-[#FF7D2B]/10 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(41,106,255,0.15)_0%,rgba(255,125,43,0.15)_50%,transparent_70%)]"></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          {/* Top chip */}
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm select-text">
            How it works
          </span>
          {/* Heading */}
          <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight select-text">
            <span className="text-[#296AFF] select-text">
              3 Easy Steps
            </span>
            <br />
            <span className="text-white select-text">to Create Your Amazon Listing</span>
          </h2>
          {/* Subtext */}
          <p className="mt-4 text-lg !text-white max-w-2xl mx-auto select-text">
            Paste your URL, let the AI audit run, and download your optimized report in minutes.
          </p>
        </div>

        {/* Steps Grid with Connectors */}
        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-[#296AFF]/0 via-[#296AFF]/60 to-[#FF7D2B]/0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.number} className="group">
                {/* Glass card */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 md:p-7 hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-300 text-center">
                  {/* Step number badge */}
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] mb-4 mx-auto" aria-hidden="true">
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </div>
                  
                  {/* Step content */}
                  <h3 className="text-lg font-semibold text-white mb-3 select-text">{step.title}</h3>
                  <p className="text-sm text-white/70 mb-4 select-text">
                    {step.desc}
                  </p>
                  
                  {/* Step illustration */}
                  <div className="flex items-center justify-center mt-4">
                    <Image 
                      src={step.img} 
                      alt={step.imgAlt} 
                      width={200} 
                      height={200}
                      className="h-40 md:h-48 w-auto mx-auto"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Micro-CTA */}
        <div className="text-center mt-12">
          <UnifiedCTA
            variant="primary"
            size="md"
            text="Start with a URL"
            onClick={onCtaClick}
            className="mx-auto"
          />
          <p className="text-xs text-white/60 mt-2">
            No signup • ~30 seconds
          </p>
        </div>
      </div>
    </section>
  );
}

'use client';

export default function HowItWorksSection() {
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
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 bg-white/[0.05] backdrop-blur-sm mb-6">
            <span className="text-sm font-medium text-white/80">How it works</span>
          </div>
          
          {/* Main heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            <span className="bg-gradient-to-r from-[#296AFF] to-white bg-clip-text text-transparent">
              3 Easy Steps
            </span>
            <br />
            <span className="text-white">to Create Your</span>
            <br />
            <span className="bg-gradient-to-r from-white to-[#FF7D2B] bg-clip-text text-transparent">
              Amazon Listing
            </span>
          </h2>
          
          {/* Subtext */}
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Paste your URL, let the AI audit run, and download your optimized report in minutes.
          </p>
        </div>

        {/* Steps Grid with Connectors */}
        <div className="relative">
          {/* Connector arrows - hidden on mobile */}
          <div className="hidden md:block absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="flex justify-between items-center px-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-white/40"></div>
              <div className="mx-4">
                <svg className="w-6 h-6 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-white/40 via-white/20 to-transparent"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {/* Step 1 */}
            <div className="group relative">
              {/* Background glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#296AFF]/10 to-[#FF7D2B]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Glass card */}
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:bg-white/[0.05] hover:-translate-y-0.5 hover:scale-105 transition-all duration-300">
                {/* Step number badge */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] mb-4 shadow-lg">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                
                {/* Step content */}
                <h3 className="text-xl font-bold text-white mb-3">Enter ASIN</h3>
                <p className="text-sm text-white/70 mb-4">
                  Paste your product URL or ASIN to get started
                </p>
                
                {/* Step illustration */}
                <div className="flex items-center justify-center h-20 w-full bg-white/[0.05] rounded-lg mt-4 group-hover:bg-white/[0.08] transition-colors">
                  <svg className="w-8 h-8 text-[#296AFF] group-hover:text-[#FF7D2B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative">
              {/* Background glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#296AFF]/10 to-[#FF7D2B]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Glass card */}
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:bg-white/[0.05] hover:-translate-y-0.5 hover:scale-105 transition-all duration-300">
                {/* Step number badge */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] mb-4 shadow-lg">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                
                {/* Step content */}
                <h3 className="text-xl font-bold text-white mb-3">AI Audit</h3>
                <p className="text-sm text-white/70 mb-4">
                  Our AI analyzes your listing for optimization opportunities
                </p>
                
                {/* Step illustration */}
                <div className="flex items-center justify-center h-20 w-full bg-white/[0.05] rounded-lg mt-4 group-hover:bg-white/[0.08] transition-colors">
                  <svg className="w-8 h-8 text-[#296AFF] group-hover:text-[#FF7D2B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative">
              {/* Background glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#296AFF]/10 to-[#FF7D2B]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Glass card */}
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:bg-white/[0.05] hover:-translate-y-0.5 hover:scale-105 transition-all duration-300">
                {/* Step number badge */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] mb-4 shadow-lg">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                
                {/* Step content */}
                <h3 className="text-xl font-bold text-white mb-3">Instant Report</h3>
                <p className="text-sm text-white/70 mb-4">
                  Download your optimized listing and checklist
                </p>
                
                {/* Step illustration */}
                <div className="flex items-center justify-center h-20 w-full bg-white/[0.05] rounded-lg mt-4 group-hover:bg-white/[0.08] transition-colors">
                  <svg className="w-8 h-8 text-[#296AFF] group-hover:text-[#FF7D2B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

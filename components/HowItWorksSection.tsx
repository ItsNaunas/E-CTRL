'use client';

export default function HowItWorksSection() {
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

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Step 1 */}
          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-300">
            {/* Step number badge */}
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] mb-4">
              <span className="text-white font-bold text-sm">1</span>
            </div>
            
            {/* Step content */}
            <h3 className="text-xl font-bold text-white mb-3">Paste Your URL</h3>
            <p className="text-sm text-white/70 mb-4">
              Enter your product page link so we can fetch details.
            </p>
            
            {/* Step image */}
            <img 
              src="/steps/url.png" 
              alt="Paste URL" 
              className="h-24 w-auto mx-auto mt-4" 
            />
          </div>

          {/* Step 2 - Placeholder */}
          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-300">
            {/* Step number badge */}
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] mb-4">
              <span className="text-white font-bold text-sm">2</span>
            </div>
            
            {/* Step content */}
            <h3 className="text-xl font-bold text-white mb-3">Step 2 Title</h3>
            <p className="text-sm text-white/70 mb-4">
              Step 2 description will go here.
            </p>
            
            {/* Step image placeholder */}
            <div className="h-24 w-full bg-white/[0.05] rounded-lg flex items-center justify-center mt-4">
              <span className="text-white/40 text-sm">Image placeholder</span>
            </div>
          </div>

          {/* Step 3 - Placeholder */}
          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-300">
            {/* Step number badge */}
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] mb-4">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            
            {/* Step content */}
            <h3 className="text-xl font-bold text-white mb-3">Step 3 Title</h3>
            <p className="text-sm text-white/70 mb-4">
              Step 3 description will go here.
            </p>
            
            {/* Step image placeholder */}
            <div className="h-24 w-full bg-white/[0.05] rounded-lg flex items-center justify-center mt-4">
              <span className="text-white/40 text-sm">Image placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

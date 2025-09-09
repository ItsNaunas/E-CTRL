'use client';

export default function Benefits() {
  const benefits = [
    {
      title: "Boost Sales",
      description: "Increase conversion rates with optimized listings",
      expertNote: "Based on 84% YoY sales increase achieved for $1.3M+ brands"
    },
    {
      title: "Find Keywords",
      description: "Discover high-impact keywords you're missing",
      expertNote: "Amazon SEO expertise from 4+ years optimizing listings"
    },
    {
      title: "Optimize Images",
      description: "Ensure compliance and better visual appeal",
      expertNote: "Optimized logistics for $10M+ enterprise accounts"
    },
    {
      title: "Quick Wins",
      description: "Implement changes that drive immediate results",
      expertNote: "22 brands launched generating $1.1M in first-year revenue"
    }
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            What you&apos;ll get from your audit
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Comprehensive analysis backed by real Amazon expertise to help you optimize every aspect of your listing.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition p-6 md:p-8 text-center hover:-translate-y-[2px] transition-transform">
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-white/80 text-sm mb-3">
                {benefit.description}
              </p>
              <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-lg p-2">
                <p className="text-xs text-[#FF6B00] font-medium">
                  {benefit.expertNote}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Expert Credibility Footer */}
        <div className="mt-12 text-center">
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition p-6 md:p-8">
            <div className="text-center mb-3">
              <h3 className="text-xl md:text-2xl font-semibold text-white">Amazon Expert Insights</h3>
            </div>
            <p className="text-white/80 mb-4">
              Every recommendation is based on real Amazon experience, not just theory
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/80">4+ years at Amazon</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/80">$5.5M client portfolio</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white/80">Proven results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

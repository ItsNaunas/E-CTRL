'use client';

import { TrendingUp, Search, Image as ImageIcon, Zap, User } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: <TrendingUp className="size-6" />,
      title: "Boost Sales",
      description: "Convert more shoppers instantly",
      expertNote: "Significant YoY sales growth",
      size: 'large' as const,
    },
    {
      icon: <Search className="size-6" />,
      title: "Find Keywords",
      description: "Capture traffic your competitors miss",
      expertNote: "4+ years Amazon SEO",
      size: 'small' as const,
    },
    {
      icon: <ImageIcon className="size-6" />,
      title: "Optimize Images",
      description: "Ensure compliance and visual appeal",
      expertNote: "$10M+ enterprise accounts",
      size: 'medium' as const,
    },
    {
      icon: <Zap className="size-6" />,
      title: "Quick Wins",
      description: "Implement changes that drive immediate results",
      expertNote: "$1.1M first-year revenue",
      size: 'medium' as const,
    }
  ];

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Charcoal background with subtle radial auras */}
      <div className="absolute inset-0 bg-[#121212]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_20%_20%,rgba(41,106,255,.06),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_80%_60%,rgba(255,125,43,.06),transparent_70%)]" />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            What you&apos;ll get from your audit
          </h2>
          <p className="text-lg !text-white max-w-2xl mx-auto">
            Comprehensive analysis backed by real Amazon expertise to help you optimize every aspect of your listing.
          </p>
        </div>
        
        {/* Bento Grid - Exact layout from reference */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6 mb-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group border-white/10 bg-white/[0.03] hover:border-white/30 relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border px-6 pt-6 pb-10 shadow-md transition-all duration-500 backdrop-blur-sm ${
                benefit.size === 'large'
                  ? 'col-span-4'
                  : benefit.size === 'medium'
                    ? 'col-span-3'
                    : 'col-span-2'
              }`}
            >
              {/* Grid pattern overlay */}
              <div className="absolute top-0 -right-1/2 z-0 size-full cursor-pointer bg-[linear-gradient(to_right,#3d16165e_1px,transparent_1px),linear-gradient(to_bottom,#3d16165e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]"></div>

              {/* Background icon */}
              <div className="text-white/5 group-hover:text-white/10 absolute right-1 bottom-3 scale-[6] transition-all duration-700 group-hover:scale-[6.2]">
                {benefit.icon}
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="bg-gradient-to-r from-[#296AFF]/20 to-[#FF7D2B]/20 text-white shadow-lg group-hover:from-[#296AFF]/30 group-hover:to-[#FF7D2B]/30 group-hover:shadow-xl mb-4 flex h-12 w-12 items-center justify-center rounded-full shadow transition-all duration-500">
                    {benefit.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold tracking-tight text-white group-hover:bg-gradient-to-r group-hover:from-[#FF7D2B] group-hover:to-[#296AFF] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-3">{benefit.description}</p>
                  <div className="inline-flex items-center gap-2 bg-[#FF7D2B]/20 border border-[#FF7D2B]/30 rounded-full px-3 py-1">
                    <span className="text-[#FF7D2B] font-semibold text-xs">
                      {benefit.expertNote}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Bottom gradient line */}
              <div className="from-[#FF7D2B] to-[#296AFF]/30 absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r blur-2xl transition-all duration-500 group-hover:blur-lg" />
            </div>
          ))}
        </div>

        {/* Amazon Expert Insights - Full width */}
        <div className="group">
          <div className="border-white/10 bg-white/[0.03] hover:border-white/30 relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border px-6 pt-6 pb-10 shadow-md transition-all duration-500 backdrop-blur-sm">
            {/* Grid pattern overlay */}
            <div className="absolute top-0 -right-1/2 z-0 size-full cursor-pointer bg-[linear-gradient(to_right,#3d16165e_1px,transparent_1px),linear-gradient(to_bottom,#3d16165e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]"></div>

            {/* Background icon */}
            <div className="text-white/5 group-hover:text-white/10 absolute right-1 bottom-3 scale-[6] transition-all duration-700 group-hover:scale-[6.2]">
              <User className="size-6" />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="bg-gradient-to-r from-[#296AFF]/20 to-[#FF7D2B]/20 text-white shadow-lg group-hover:from-[#296AFF]/30 group-hover:to-[#FF7D2B]/30 group-hover:shadow-xl mb-4 flex h-12 w-12 items-center justify-center rounded-full shadow transition-all duration-500">
                  <User className="size-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold tracking-tight text-white group-hover:bg-gradient-to-r group-hover:from-[#FF7D2B] group-hover:to-[#296AFF] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  Amazon Expert Insights
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Every recommendation is based on real Amazon experience, not just theory
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#296AFF] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-white/80 text-sm">4+ years at Amazon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#296AFF] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-white/80 text-sm">$5.5M client portfolio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#296AFF] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-white/80 text-sm">Proven results</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom gradient line */}
            <div className="from-[#FF7D2B] to-[#296AFF]/30 absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r blur-2xl transition-all duration-500 group-hover:blur-lg" />
          </div>
        </div>

        {/* Gradient divider */}
        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
    </section>
  );
}

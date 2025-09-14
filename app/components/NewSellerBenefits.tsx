'use client';

import { Zap, Target, Search, TrendingUp, DollarSign, Rocket } from 'lucide-react';

export default function NewSellerBenefits() {
  const benefits = [
    {
      icon: <Zap className="size-6" />,
      title: "Launch Faster",
      description: "Skip the manual work. Get a complete Amazon listing ready in minutes, not days.",
      size: 'large' as const,
    },
    {
      icon: <Target className="size-6" />,
      title: "Optimized for Conversion",
      description: "Every word is crafted to maximize sales and visibility on Amazon.",
      size: 'small' as const,
    },
    {
      icon: <Search className="size-6" />,
      title: "SEO-Ready",
      description: "Built-in keyword optimization ensures your product gets found by the right customers.",
      size: 'medium' as const,
    },
    {
      icon: <TrendingUp className="size-6" />,
      title: "Proven Structure",
      description: "Follows Amazon's best practices for titles, descriptions, and listing structure that convert.",
      size: 'medium' as const,
    },
    {
      icon: <DollarSign className="size-6" />,
      title: "Cost Effective",
      description: "Save thousands on professional listing creation. Get the same quality for free.",
      size: 'small' as const,
    },
    {
      icon: <Rocket className="size-6" />,
      title: "Ready to Scale",
      description: "Use the same process for all your products. Consistent, professional results every time.",
      size: 'large' as const,
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
            Why create your Amazon listing with us?
          </h2>
          <p className="text-lg !text-white max-w-2xl mx-auto">
            Transform your existing product page into a professional Amazon listing that converts.
          </p>
        </div>
        
        {/* Bento Grid - Exact layout from reference */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6">
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
                  <p className="text-white/70 text-sm">{benefit.description}</p>
                </div>
                <div className="text-[#FF7D2B] mt-4 flex items-center text-sm">
                  <span className="mr-1">Learn more</span>
                  <span className="transition-all duration-500 group-hover:translate-x-2">→</span>
                </div>
              </div>
              
              {/* Bottom gradient line */}
              <div className="from-[#FF7D2B] to-[#296AFF]/30 absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r blur-2xl transition-all duration-500 group-hover:blur-lg" />
            </div>
          ))}
        </div>

        {/* CTA Section - Full width */}
        <div className="mt-12 group">
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-r from-[#FF7D2B]/10 to-[#296AFF]/10 backdrop-blur-sm p-8 hover:bg-gradient-to-r hover:from-[#FF7D2B]/15 hover:to-[#296AFF]/15 hover:-translate-y-1 hover:border-[#FF7D2B]/30 hover:shadow-[0_8px_32px_rgba(255,125,43,0.2)] transition-all duration-300">
            {/* Gradient border effect on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF7D2B]/20 to-[#296AFF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:bg-gradient-to-r group-hover:from-[#FF7D2B] group-hover:to-[#296AFF] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                Ready to create your Amazon listing?
              </h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Join thousands of brand owners who&apos;ve successfully launched their products on Amazon using our AI-powered listing creation tool.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="bg-white/[0.1] border border-white/20 rounded-lg px-4 py-2">
                  <div className="text-xl font-bold text-white">Optimization Checklist</div>
                  <div className="text-white/70 text-sm">Complete listing guide</div>
                </div>
                <div className="bg-white/[0.1] border border-white/20 rounded-lg px-4 py-2">
                  <div className="text-xl font-bold text-white">100% Free</div>
                  <div className="text-white/70 text-sm">No credit card required</div>
                </div>
                <div className="bg-white/[0.1] border border-white/20 rounded-lg px-4 py-2">
                  <div className="text-xl font-bold text-white">Instant</div>
                  <div className="text-white/70 text-sm">Get results in minutes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient divider */}
        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
    </section>
  );
}

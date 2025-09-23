'use client';

import { Gift, CreditCard, Shield, Zap } from 'lucide-react';

export default function Guarantees() {
  const guarantees = [
    {
      icon: <Gift className="size-6" />,
      title: "Free forever",
      description: "No hidden costs or premium tiers",
      size: 'large' as const,
    },
    {
      icon: <CreditCard className="size-6" />,
      title: "No credit card required",
      description: "Start your audit immediately",
      size: 'small' as const,
    },
    {
      icon: <Shield className="size-6" />,
      title: "Secure & private",
      description: "Your data is never shared",
      size: 'medium' as const,
    },
    {
      icon: <Zap className="size-6" />,
      title: "Instant results",
      description: "Get insights in seconds",
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
            Why Choose Our Free Amazon Audit Tool?
          </h2>
          <p className="text-lg !text-white max-w-2xl mx-auto">
            We&apos;re committed to helping Amazon sellers succeed with transparent, secure, and effective tools.
          </p>
        </div>

        {/* Bento Grid - Exact layout from reference */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6 mb-8">
          {guarantees.map((guarantee, index) => (
            <div
              key={index}
              className={`group border-white/10 bg-white/[0.03] hover:border-white/30 relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border px-6 pt-6 pb-10 shadow-md transition-all duration-500 backdrop-blur-sm ${
                guarantee.size === 'large'
                  ? 'col-span-4'
                  : guarantee.size === 'medium'
                    ? 'col-span-3'
                    : 'col-span-2'
              }`}
            >
              {/* Grid pattern overlay */}
              <div className="absolute top-0 -right-1/2 z-0 size-full cursor-pointer bg-[linear-gradient(to_right,#3d16165e_1px,transparent_1px),linear-gradient(to_bottom,#3d16165e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]"></div>

              {/* Background icon */}
              <div className="text-white/5 group-hover:text-white/10 absolute right-1 bottom-3 scale-[6] transition-all duration-700 group-hover:scale-[6.2]">
                {guarantee.icon}
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="bg-gradient-to-r from-[#296AFF]/20 to-[#FF7D2B]/20 text-white shadow-lg group-hover:from-[#296AFF]/30 group-hover:to-[#FF7D2B]/30 group-hover:shadow-xl mb-4 flex h-12 w-12 items-center justify-center rounded-full shadow transition-all duration-500">
                    {guarantee.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold tracking-tight text-white group-hover:bg-gradient-to-r group-hover:from-[#FF7D2B] group-hover:to-[#296AFF] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {guarantee.title}
                  </h3>
                  <p className="text-white/70 text-sm">{guarantee.description}</p>
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

        {/* Security badges - Full width */}
        <div className="group">
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-300">
            {/* Gradient border effect on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#296AFF]/10 to-[#FF7D2B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <span className="text-[#296AFF]">🔐</span>
                  <span>SSL Encrypted</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <span className="text-[#FF7D2B]">📧</span>
                  <span>No spam emails</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <span className="text-white/60">🚫</span>
                  <span>No data selling</span>
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

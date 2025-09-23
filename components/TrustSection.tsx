'use client';

export default function TrustSection() {
  const stats = [
    { label: "Amazon Marketplace Experience", value: "4+ Years" },
    { label: "Revenue Generated", value: "$1.1M in new product launches" },
    { label: "Active Client Portfolio", value: "$5.5M managed" },
    { label: "Average Sales Growth", value: "Breakthrough Results" },
  ];

  return (
    <section className="relative bg-[#0B0B0C] text-white py-16">
      {/* background auras */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_20%,#0e132d,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(65%_55%_at_80%_35%,#2a0f03,transparent_60%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Gradient headline bar */}
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-[#296AFF] to-white bg-clip-text text-transparent">
              500+
            </span>
            <br />
            <span className="text-white">Amazon audits completed</span>
            <br />
            <span className="bg-gradient-to-r from-white to-[#FF7D2B] bg-clip-text text-transparent">
              this month
            </span>
          </h2>
        </div>

        {/* thin divider */}
        <div className="mx-auto mt-8 h-px w-56 bg-gradient-to-r from-[#296AFF]/0 via-[#296AFF]/60 to-[#FF7D2B]/0" />

        {/* glass container */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-sm p-6 md:p-8">
          <h3 className="text-center text-2xl md:text-3xl font-semibold">Meet Your Amazon Expert</h3>

          {/* stat pills */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group rounded-[45px] border border-white/10 bg-white/[0.04] px-6 py-4
                           shadow-[inset_0_1px_0_0_rgba(255,255,255,.05)]
                           hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-300
                           text-center"
              >
                <div className="text-[13px] text-white/65">{s.label}</div>
                <div
                  className="mt-1 text-xl font-semibold text-[#296AFF] tracking-tight"
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* authority line */}
          <p className="mt-8 text-center text-lg text-white/80 leading-relaxed">
            <span className="bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] bg-clip-text text-transparent font-medium">
              Built by ex-Amazon consultant
            </span>
            <br />
            <span className="text-white/70 text-base">
              specializing in seller growth & optimization
            </span>
          </p>
        </div>

        {/* guarantees row (replaces logos) */}
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <li className="group inline-flex items-center gap-2 rounded-full border border-[#FF7D2B66] bg-white/[0.04] px-4 py-2 text-sm text-white/90 transition-all duration-300 hover:border-[#FF7D2B] hover:bg-white/[0.06] hover:shadow-[0_0_20px_rgba(255,125,43,0.4)]">
            <div className="h-4 w-4 rounded-full bg-[#FF7D2B] flex items-center justify-center group-hover:bg-[#FF7D2B] transition-colors">
              <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Secure & private</span>
          </li>
          <li className="group inline-flex items-center gap-2 rounded-full border border-[#296AFF66] bg-white/[0.04] px-4 py-2 text-sm text-white/90 transition-all duration-300 hover:border-[#296AFF] hover:bg-white/[0.06] hover:shadow-[0_0_20px_rgba(41,106,255,0.4)]">
            <div className="h-4 w-4 rounded-full bg-[#296AFF] flex items-center justify-center group-hover:bg-[#296AFF] transition-colors">
              <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Instant results</span>
          </li>
          <li className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2 text-sm text-white/80 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.06] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span>100% free forever</span>
          </li>
        </ul>

        {/* bottom divider */}
        <div className="mx-auto mt-12 h-px w-40 bg-gradient-to-r from-[#296AFF]/0 via-[#296AFF]/30 to-[#FF7D2B]/0" />
      </div>
    </section>
  );
}

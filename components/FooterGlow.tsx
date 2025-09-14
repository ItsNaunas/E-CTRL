'use client';

import UnifiedCTA from './UnifiedCTA';

interface FooterGlowProps {
  onCtaClick?: () => void;
}

export default function FooterGlow({ onCtaClick }: FooterGlowProps) {
  return (
    <footer className="bg-[#0B0B0C] text-white">
      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-10
                        border border-white/10 bg-white/[0.03] backdrop-blur-sm">
          {/* soft auras */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-10 h-64 w-64 rounded-full bg-[#296AFF]/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#FF7D2B]/20 blur-3xl" />
          </div>

          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Start Your Free Amazon Audit Today
            </h2>
            <p className="mt-3 text-white/70 max-w-2xl mx-auto">
              Get actionable insights to boost your Amazon sales. No credit card. No spam.
            </p>

            <div className="mt-6 flex items-center justify-center">
              <UnifiedCTA
                variant="primary"
                size="lg"
                text="Get My Free Audit Report"
                onClick={onCtaClick}
                className="w-full max-w-[400px]"
              />
            </div>

            {/* microcopy */}
            <p className="mt-4 text-sm text-white/70">
              Free forever • No credit card required • Get results in minutes
            </p>
          </div>
        </div>
      </section>

      {/* gradient divider */}
      <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-[#296AFF]/0 via-[#296AFF]/60 to-[#FF7D2B]/0" />

      {/* main footer */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#296AFF] to-[#FF7D2B] text-white font-bold text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </span>
              <span className="text-base font-semibold">e-ctrl</span>
            </div>
            <p className="mt-3 text-sm text-white/70 max-w-sm">
              Free Amazon audit tool backed by 4+ years of real Amazon experience.
              Launch faster and sell smarter with AI.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <a className="rounded-full border border-white/10 bg-white/[0.04] p-2 hover:bg-white/[0.08] transition" href="#">
                <svg className="h-4 w-4 opacity-80" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.36 8.6 8.6 0 0 1-2.72 1.05A4.26 4.26 0 0 0 12 8.26c0 .33.04.65.1.96A12.09 12.09 0 0 1 3 5.15a4.26 4.26 0 0 0 1.32 5.67 4.2 4.2 0 0 1-1.93-.53v.05a4.26 4.26 0 0 0 3.43 4.17c-.47.13-.97.2-1.48.08a4.26 4.26 0 0 0 3.98 2.96A8.54 8.54 0 0 1 2 19.54a12.06 12.06 0 0 0 6.53 1.91c7.84 0 12.13-6.5 12.13-12.13 0-.18 0-.36-.01-.54A8.64 8.64 0 0 0 22.46 6z"/></svg>
              </a>
              <a className="rounded-full border border-white/10 bg-white/[0.04] p-2 hover:bg-white/[0.08] transition" href="#">
                <svg className="h-4 w-4 opacity-80" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C3.33 3.5 2 4.83 2 6.48c0 1.64 1.33 2.97 2.98 2.97 1.64 0 2.97-1.33 2.97-2.97 0-1.65-1.33-2.98-2.97-2.98zM3 8.98h4v12H3v-12zM9 8.98h3.82v1.64h.05c.53-.99 1.83-2.03 3.77-2.03 4.04 0 4.78 2.66 4.78 6.12v6.27h-4v-5.56c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.65H9v-12z"/></svg>
              </a>
              <a className="rounded-full border border-white/10 bg-white/[0.04] p-2 hover:bg-white/[0.08] transition" href="#">
                <svg className="h-4 w-4 opacity-80" viewBox="0 0 24 24" fill="currentColor"><path d="M10 15l5.19-3L10 9v6zm12-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
              </a>
            </div>
          </div>

          {/* links */}
          <div>
            <h4 className="text-sm font-semibold">Tool</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><a href="#hero" className="hover:text-white transition">Free Audit</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
              <li><a href="#benefits" className="hover:text-white transition">Benefits</a></li>
              <li><a href="#testimonials" className="hover:text-white transition">Testimonials</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><a href="#trust" className="hover:text-white transition">Our Expertise</a></li>
              <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><a href="/legal/privacy" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="/legal/terms" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </section>

      {/* bottom legal bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-white/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} e-ctrl. Free Amazon audit tool for sellers worldwide.</p>
          <div className="flex items-center gap-4">
            <span>GDPR-compliant</span>
            <span>SSL encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

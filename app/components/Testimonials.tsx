'use client';

import Image from 'next/image';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Amazon FBA Seller",
      location: "United States",
      content: "The audit revealed missing keywords that significantly boosted my sales in just 2 weeks. The expert insights were spot-on!",
      avatar: "/avatars/placeholder.png",
      result: "Significant sales increase in 2 weeks"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "E-commerce Entrepreneur",
      location: "Canada",
      content: "Finally found a tool backed by real Amazon experience. My conversion rate improved substantially after implementing the recommendations.",
      avatar: "/avatars/placeholder.png",
      result: "Substantial conversion rate improvement"
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "Amazon Seller",
      location: "Australia",
      content: "Free tool that actually works! The recommendations were based on real Amazon expertise, not just generic advice.",
      avatar: "/avatars/placeholder.png",
      result: "Significant ROI improvement"
    }
  ];

  return (
    <section className="py-16 md:py-20" data-testid="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Trusted by Amazon Sellers Worldwide
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            See what other sellers are saying about their audit results from our Amazon expert
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition p-6 md:p-8 hover:-translate-y-[2px] transition-transform" data-testid="testimonial-card">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-white/80">{testimonial.role}</div>
                  <div className="text-xs text-white/60">{testimonial.location}</div>
                </div>
              </div>
              
              <blockquote className="text-white/90 italic mb-4">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              {/* Result Highlight */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <div className="text-center">
                  <span className="text-sm font-medium text-green-400">{testimonial.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expert Credibility Section */}
        <div className="mt-12 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition p-6 md:p-8">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
              Backed by Real Amazon Expertise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition p-4">
                <div className="font-semibold text-white">4+ Years at Amazon</div>
                <div className="text-white/80">Marketplace expertise</div>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition p-4">
                <div className="font-semibold text-white">22 Brands Launched</div>
                <div className="text-white/80">$1.1M in new product launches</div>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition p-4">
                <div className="font-semibold text-white">$5.5M Portfolio</div>
                <div className="text-white/80">Active client portfolio</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-white/60">
            * Results may vary. These testimonials represent individual experiences.
          </p>
          {/* TODO: Add client-provided disclaimer or legal text */}
        </div>
      </div>
    </section>
  );
}

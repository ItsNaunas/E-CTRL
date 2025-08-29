'use client';

import Image from 'next/image';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Amazon FBA Seller",
      location: "United States",
      content: "The audit revealed missing keywords that boosted my sales by 40% in just 2 weeks. The expert insights were spot-on!",
      avatar: "/avatars/placeholder.png",
      result: "40% sales increase in 2 weeks"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "E-commerce Entrepreneur",
      location: "Canada",
      content: "Finally found a tool backed by real Amazon experience. My conversion rate improved by 35% after implementing the recommendations.",
      avatar: "/avatars/placeholder.png",
      result: "35% conversion rate improvement"
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
    <section className="py-16 bg-white" data-testid="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Amazon Sellers Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what other sellers are saying about their audit results from our Amazon expert
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow" data-testid="testimonial-card">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-xs text-gray-500">{testimonial.location}</div>
                </div>
              </div>
              
              <blockquote className="text-gray-700 italic mb-4">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              {/* Result Highlight */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-center">
                  <span className="text-sm font-medium text-green-800">{testimonial.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expert Credibility Section */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Backed by Real Amazon Expertise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="font-semibold text-gray-900">5+ Years at Amazon</div>
                <div className="text-gray-600">Seller growth & optimization</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="font-semibold text-gray-900">22 Brands Launched</div>
                <div className="text-gray-600">$1.1M revenue generated</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="font-semibold text-gray-900">$5.5M Portfolio</div>
                <div className="text-gray-600">Active client management</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            * Results may vary. These testimonials represent individual experiences.
          </p>
          {/* TODO: Add client-provided disclaimer or legal text */}
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Amazon Seller",
      location: "UK",
      content: "The audit helped me identify missing keywords that boosted my sales by 40% in just 2 weeks.",
      avatar: "/avatars/sarah.jpg" // TODO: Add real avatar images
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "E-commerce Entrepreneur", 
      location: "Germany",
      content: "Finally found a tool that actually gives actionable insights. My conversion rate improved significantly.",
      avatar: "/avatars/michael.jpg"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Amazon FBA Seller",
      location: "Spain", 
      content: "Free tool that actually works! The recommendations were spot-on and easy to implement.",
      avatar: "/avatars/emma.jpg"
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
            See what other sellers are saying about their audit results
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 border border-gray-100">
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
              
              <blockquote className="text-gray-700 italic">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            * Results may vary. These testimonials represent individual experiences.
          </p>
        </div>
      </div>
    </section>
  );
}

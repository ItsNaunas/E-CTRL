'use client';

export default function NewSellerBenefits() {
  const benefits = [
    {
      icon: "⚡",
      title: "Launch Faster",
      description: "Skip the manual work. Get a complete Amazon listing ready in minutes, not days."
    },
    {
      icon: "🎯",
      title: "Optimized for Conversion",
      description: "Every image and word is crafted to maximize sales and visibility on Amazon."
    },
    {
      icon: "🔍",
      title: "SEO-Ready",
      description: "Built-in keyword optimization ensures your product gets found by the right customers."
    },
    {
      icon: "📈",
      title: "Proven Structure",
      description: "Follows Amazon's best practices for titles, images, and descriptions that convert."
    },
    {
      icon: "💰",
      title: "Cost Effective",
      description: "Save thousands on professional listing creation. Get the same quality for free."
    },
    {
      icon: "🚀",
      title: "Ready to Scale",
      description: "Use the same process for all your products. Consistent, professional results every time."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why create your Amazon listing with us?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your existing product page into a professional Amazon listing that converts.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
                         <h3 className="text-2xl font-bold mb-4">
               Ready to create your Amazon listing?
             </h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Join thousands of brand owners who've successfully launched their products on Amazon using our AI-powered listing creation tool.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">6 Images</div>
                <div className="text-orange-100 text-sm">Optimized for conversion</div>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">100% Free</div>
                <div className="text-orange-100 text-sm">No credit card required</div>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">Instant</div>
                <div className="text-orange-100 text-sm">Get results in minutes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

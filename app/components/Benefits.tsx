'use client';

export default function Benefits() {
  const benefits = [
    {
      icon: "📈",
      title: "Boost Sales",
      description: "Increase conversion rates with optimized listings"
    },
    {
      icon: "🔍",
      title: "Find Keywords",
      description: "Discover high-impact keywords you're missing"
    },
    {
      icon: "🖼️",
      title: "Optimize Images",
      description: "Ensure compliance and better visual appeal"
    },
    {
      icon: "⚡",
      title: "Quick Wins",
      description: "Implement changes that drive immediate results"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What you&apos;ll get from your audit
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive analysis to help you optimize every aspect of your Amazon listing.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg p-6 border border-gray-100 text-center">
              <div className="text-3xl mb-4">{benefit.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

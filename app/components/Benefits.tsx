'use client';

export default function Benefits() {
  const benefits = [
    {
      title: "Boost Sales",
      description: "Increase conversion rates with optimized listings",
      expertNote: "Based on 84% YoY sales increase achieved for $1.3M+ brands"
    },
    {
      title: "Find Keywords",
      description: "Discover high-impact keywords you're missing",
      expertNote: "Amazon SEO expertise from 5+ years optimizing listings"
    },
    {
      title: "Optimize Images",
      description: "Ensure compliance and better visual appeal",
      expertNote: "Optimized logistics for $10M+ enterprise accounts"
    },
    {
      title: "Quick Wins",
      description: "Implement changes that drive immediate results",
      expertNote: "22 brands launched generating $1.1M in first-year revenue"
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
            Comprehensive analysis backed by real Amazon expertise to help you optimize every aspect of your listing.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg p-6 border border-gray-100 text-center hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {benefit.description}
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                <p className="text-xs text-orange-800 font-medium">
                  {benefit.expertNote}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Expert Credibility Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Amazon Expert Insights</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Every recommendation is based on real Amazon experience, not just theory
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">5+ years at Amazon</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">$5.5M client portfolio</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Proven results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

export default function HowItWorks() {
  const steps = [
    {
      icon: "🔍",
      title: "Enter ASIN + Email",
      description: "Paste your product URL/ASIN and your email to unlock the basic audit"
    },
    {
      icon: "🤖", 
      title: "Instant AI Audit (Basic)",
      description: "We email you the key findings and quick wins"
    },
    {
      icon: "📧",
      title: "Create Account for Full Report",
      description: "Register to unlock the full audit, detailed recommendations, and export"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get actionable insights for your Amazon business in three simple steps.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

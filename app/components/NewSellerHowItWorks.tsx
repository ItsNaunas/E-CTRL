'use client';

export default function NewSellerHowItWorks() {
  const steps = [
    {
      icon: "🌐",
      title: "Enter Your Product URL",
      description: "Paste your product landing page URL from your website"
    },
    {
      icon: "🤖", 
      title: "AI Analysis",
      description: "Our AI analyzes your product and creates optimized Amazon assets"
    },
    {
      icon: "📧",
      title: "Get Your Listing",
      description: "Receive optimization checklist + complete listing via email"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How it works for new Amazon sellers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your existing product page into a complete Amazon listing in three simple steps.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full flex items-center justify-center text-white text-2xl">
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
        
        {/* Additional Info */}
        <div className="mt-12 bg-gradient-to-r from-brand-orange-light to-orange-100 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What You&apos;ll Get
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">📸</div>
                <h4 className="font-semibold text-gray-900 mb-1">Optimization Checklist</h4>
                <p className="text-sm text-gray-600">Complete checklist covering title, bullets, description, keywords, and listing requirements</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">📝</div>
                <h4 className="font-semibold text-gray-900 mb-1">SEO-Optimized Title</h4>
                <p className="text-sm text-gray-600">Structured for maximum visibility and conversion</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">💡</div>
                <h4 className="font-semibold text-gray-900 mb-1">Benefit-Focused Copy</h4>
                <p className="text-sm text-gray-600">5-10 bullet points highlighting key product benefits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

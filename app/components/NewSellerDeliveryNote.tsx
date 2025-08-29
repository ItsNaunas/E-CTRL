'use client';

export default function NewSellerDeliveryNote({ email }: { email: string }) {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white">
                Your Amazon Listing is Being Created!
              </h2>
              <p className="text-orange-100 mt-2">
                Check your email for your complete listing package
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 mb-4">
                We&apos;ve sent your complete Amazon listing to:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 inline-block">
                <span className="font-medium text-gray-900">{email}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              
              {/* What's in your email */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📧 What&apos;s in your email:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">6 optimized Amazon images</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">SEO-optimized listing title</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">5-10 benefit-focused bullet points</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">Complete product description</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">Step-by-step upload guide</span>
                  </div>
                </div>
              </div>
              
              {/* Next steps */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🚀 Next steps:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</span>
                    <span className="text-gray-700">Check your email (check spam folder too)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</span>
                    <span className="text-gray-700">Download your listing assets</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</span>
                    <span className="text-gray-700">Upload to your Amazon seller account</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">4</span>
                    <span className="text-gray-700">Launch your product and start selling!</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💡 Pro Tips for Success:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <strong>Image Optimization:</strong> Use all 6 images to maximize your listing&apos;s conversion potential.
                </div>
                <div>
                  <strong>Keyword Research:</strong> The title and description are already optimized for search visibility.
                </div>
                <div>
                  <strong>Competitive Pricing:</strong> Research similar products to set competitive prices.
                </div>
                <div>
                  <strong>Customer Service:</strong> Be ready to respond quickly to customer questions and reviews.
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">
                  Need help with your Amazon seller account?
                </h3>
                <p className="text-orange-100 mb-4">
                  We&apos;ve got resources to help you get started and succeed on Amazon.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://sellercentral.amazon.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-orange-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Amazon Seller Central
                  </a>
                  <a 
                    href="https://amazon.com/seller" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white/20 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

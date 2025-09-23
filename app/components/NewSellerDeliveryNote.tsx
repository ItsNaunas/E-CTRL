'use client';

export default function NewSellerDeliveryNote({ email }: { email: string }) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] px-8 py-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                Your Amazon Listing is Being Created!
              </h2>
              <p className="text-white/90 mt-2">
                Check your email for your complete listing package with PDF
              </p>
              <div className="mt-3 bg-white/20 rounded-lg px-4 py-2 inline-block">
                <span className="text-white text-sm font-medium">✓ PDF Report Sent</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-lg text-white/70 mb-4">
                We&apos;ve sent your complete Amazon listing to:
              </p>
              <div className="bg-white/10 border border-white/20 rounded-lg p-4 inline-block">
                <span className="font-medium text-white">{email}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              
              {/* What's in your email */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  📧 What&apos;s in your email:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-white/90">Complete Amazon listing optimization checklist</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-white/90">SEO-optimized listing title</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-white/90">5-10 benefit-focused bullet points</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-white/90">Complete product description</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-white/90">Step-by-step upload guide</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-white/90">Complete PDF listing pack</span>
                  </div>
                </div>
              </div>
              
              {/* Next steps */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  🚀 Next steps:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-[#296AFF]/20 text-[#296AFF] border border-[#296AFF]/30 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</span>
                    <span className="text-white/90">Check your email (check spam folder too)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-[#296AFF]/20 text-[#296AFF] border border-[#296AFF]/30 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</span>
                    <span className="text-white/90">Download your listing assets</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-[#296AFF]/20 text-[#296AFF] border border-[#296AFF]/30 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</span>
                    <span className="text-white/90">Upload to your Amazon seller account</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-[#296AFF]/20 text-[#296AFF] border border-[#296AFF]/30 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">4</span>
                    <span className="text-white/90">Launch your product and start selling!</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tips */}
            <div className="bg-gradient-to-r from-[#296AFF]/10 to-[#FF7D2B]/10 border border-white/10 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">
                💡 Pro Tips for Success:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
                <div>
                  <strong className="text-white">Optimization Checklist:</strong> Follow the complete checklist to maximize your listing&apos;s conversion potential.
                </div>
                <div>
                  <strong className="text-white">Keyword Research:</strong> The title and description are already optimized for search visibility.
                </div>
                <div>
                  <strong className="text-white">Competitive Pricing:</strong> Research similar products to set competitive prices.
                </div>
                <div>
                  <strong className="text-white">Customer Service:</strong> Be ready to respond quickly to customer questions and reviews.
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] rounded-xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">
                  Need help with your Amazon seller account?
                </h3>
                <p className="text-white/90 mb-4">
                  We&apos;ve got resources to help you get started and succeed on Amazon.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://sellercentral.amazon.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-[#296AFF] px-6 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
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

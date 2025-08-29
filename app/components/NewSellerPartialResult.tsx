'use client';

import CTAButton from '@/components/CTAButton';

interface NewSellerPartialResultProps {
  productUrl: string;
  onUnlock: () => void;
}

export default function NewSellerPartialResult({ productUrl, onUnlock }: NewSellerPartialResultProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white break-words">
                  Amazon Listing Creation Preview
                </h2>
                <p className="text-orange-100 mt-1 text-sm break-all">
                  Generated from: {productUrl}
                </p>
              </div>
              <div className="text-center sm:text-right flex-shrink-0">
                <div className="text-2xl sm:text-3xl font-bold text-white">6 Images</div>
                <div className="text-orange-100 text-sm">Ready to Create</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column - Image Preview */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Generated Images Preview
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl flex-shrink-0">📸</span>
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-gray-900 block">Main Product Image</span>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">Product on white background, 85% frame coverage</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl flex-shrink-0">🎯</span>
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-gray-900 block">Lifestyle Image</span>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">Product in use, showing real-world application</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl flex-shrink-0">📊</span>
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-gray-900 block">Benefits Infographic</span>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">Key product benefits and features visualization</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl flex-shrink-0">📏</span>
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-gray-900 block">Measurements Image</span>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">Product dimensions and sizing information</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl flex-shrink-0">🔍</span>
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-gray-900 block">Cross-Section View</span>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">Product anatomy showing quality construction</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl flex-shrink-0">⚔️</span>
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-gray-900 block">Competitive Comparison</span>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">Your product vs competitors (optional)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Listing Preview */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Complete Amazon Listing
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">What You&apos;ll Get:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 5-10 benefit-focused bullet points</li>
                      <li>• SEO-optimized product description</li>
                      <li>• Keyword-rich content for better indexing</li>
                      <li>• Conversion-optimized copy</li>
                      <li>• Ready-to-use Amazon listing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Create Your Amazon Listing?
                </h3>
                <p className="text-gray-600 mb-6">
                  Get your complete listing with 6 optimized images and conversion-focused copy delivered to your email.
                </p>
                
                                 <CTAButton
                   variant="primary"
                   size="lg"
                   text="get my complete listing now"
                   onClick={onUnlock}
                   className="px-8"
                 />
                
                <p className="text-sm text-gray-500 mt-3">
                  No credit card required • Instant delivery • 100% free
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

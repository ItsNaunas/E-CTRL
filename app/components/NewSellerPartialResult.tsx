'use client';

import CTAButton from '@/components/CTAButton';

interface NewSellerPartialResultProps {
  productUrl?: string;
  manualData?: {
    category: string;
    description: string;
    keywords: string[];
    fulfilmentIntent: string;
  };
  onUnlock: () => void;
  score?: number;
  highlights?: string[];
  isLoading?: boolean;
}

export default function NewSellerPartialResult({ productUrl, manualData, onUnlock, score, highlights, isLoading }: NewSellerPartialResultProps) {
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
                {productUrl ? (
                  <p className="text-orange-100 mt-1 text-sm break-all">
                    Generated from: {productUrl}
                  </p>
                ) : manualData ? (
                  <p className="text-orange-100 mt-1 text-sm">
                    Generated from: {manualData.category} - {manualData.description.substring(0, 50)}...
                  </p>
                ) : (
                  <p className="text-orange-100 mt-1 text-sm">
                    Ready to create your Amazon listing
                  </p>
                )}
              </div>
              <div className="text-center sm:text-right flex-shrink-0">
                {isLoading ? (
                  <>
                    <div className="text-2xl sm:text-3xl font-bold text-white">Analyzing...</div>
                    <div className="text-orange-100 text-sm">AI processing</div>
                  </>
                ) : highlights && highlights.length > 0 ? (
                  <>
                    <div className="text-2xl sm:text-3xl font-bold text-white">IDQ Ready</div>
                    <div className="text-orange-100 text-sm">Optimized for Amazon</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl sm:text-3xl font-bold text-white">6 Images</div>
                    <div className="text-orange-100 text-sm">Ready to Create</div>
                  </>
                )}
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
                  {/* AI Analysis Highlights */}
                  {isLoading ? (
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-2/3 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  ) : highlights && highlights.length > 0 ? (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">IDQ Analysis Highlights:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {highlights.map((highlight, index) => (
                          <li key={index}>• {highlight}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">IDQ Optimization Guide:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Field-by-field IDQ analysis</li>
                        <li>• Optimized title for highest IDQ score</li>
                        <li>• IDQ-compliant bullet points</li>
                        <li>• SEO-optimized product description</li>
                        <li>• Complete keyword strategy</li>
                        <li>• 6-image requirements for IDQ</li>
                      </ul>
                    </div>
                  )}
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
                  Get your complete Amazon listing optimization checklist and conversion-focused copy delivered to your email.
                </p>
                
                                 <CTAButton
                   variant="primary"
                   size="lg"
                   text={isLoading ? "analyzing..." : "get my complete listing now"}
                   onClick={onUnlock}
                   className="px-8"
                   disabled={isLoading}
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

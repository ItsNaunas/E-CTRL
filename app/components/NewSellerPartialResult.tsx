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
  // Debug logging
  console.log('NewSellerPartialResult props:', { productUrl, manualData, score, highlights, isLoading });
  console.log('Highlights check:', { 
    highlights, 
    hasHighlights: !!highlights, 
    highlightsLength: highlights?.length, 
    condition: highlights && highlights.length > 0 
  });
  
  // Extract detailed analysis from highlights if available
  const hasDetailedAnalysis = highlights && highlights.length > 0 && 
    !highlights.some(h => h.includes('AI analysis in progress') || h.includes('Ready to analyze'));
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white break-words">
                  {hasDetailedAnalysis ? "Your Amazon Listing Analysis" : "Amazon Listing Creator"}
                </h2>
                {productUrl ? (
                  <p className="text-orange-100 mt-1 text-sm break-all">
                    Analyzing: {productUrl}
                  </p>
                ) : manualData ? (
                  <p className="text-orange-100 mt-1 text-sm">
                    Product: {manualData.category} - {manualData.description.substring(0, 50)}...
                  </p>
                ) : (
                  <p className="text-orange-100 mt-1 text-sm">
                    Enter a product URL to get started
                  </p>
                )}
              </div>
              <div className="text-center sm:text-right flex-shrink-0">
                {isLoading ? (
                  <>
                    <div className="text-2xl sm:text-3xl font-bold text-white">Analyzing...</div>
                    <div className="text-orange-100 text-sm">Scraping & AI processing</div>
                  </>
                ) : hasDetailedAnalysis ? (
                  <>
                    <div className="text-2xl sm:text-3xl font-bold text-white">Analysis Complete</div>
                    <div className="text-orange-100 text-sm">Ready for Amazon</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl sm:text-3xl font-bold text-white">Ready</div>
                    <div className="text-orange-100 text-sm">Enter URL above</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Your Product</h3>
                <p className="text-gray-600">Scraping product data and generating Amazon listing recommendations...</p>
              </div>
            ) : hasDetailedAnalysis ? (
              <div className="space-y-6">
                {/* Product Analysis Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Your Amazon Listing Analysis</h3>
                  <p className="text-gray-700 mb-4">
                    Based on your product page analysis, here&apos;s what we found and how to optimize it for Amazon&apos;s IDQ requirements:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <h4 className="font-medium text-gray-900 mb-2">📊 Current Status</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Product data scraped successfully</li>
                        <li>• IDQ requirements analyzed</li>
                        <li>• Amazon listing recommendations ready</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <h4 className="font-medium text-gray-900 mb-2">🚀 Next Steps</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Review optimized title & bullets</li>
                        <li>• Get complete listing strategy</li>
                        <li>• Receive keyword recommendations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Generated Amazon Listing Content */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Your Generated Amazon Listing</h3>
                  
                  {/* Title Section */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-orange-500">📝</span> Your Amazon Title
                    </h4>
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <p className="text-gray-800 font-medium text-lg leading-relaxed">
                        {highlights && highlights.length > 0 ? highlights[0] : "Loading title..."}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">✅ IDQ-compliant • ✅ Brand included • ✅ Keywords optimized</p>
                    </div>
                  </div>

                  {/* Bullet Points Section */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-orange-500">🎯</span> Your Bullet Points
                    </h4>
                    <div className="space-y-3">
                      {highlights && highlights.length > 1 ? highlights.slice(1, 6).map((bullet, index) => (
                        <div key={index} className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                          <div className="flex items-start gap-3">
                            <span className="text-orange-500 font-bold text-lg mt-0.5">{index + 1}</span>
                            <p className="text-gray-800 text-sm leading-relaxed font-medium">{bullet}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="bg-white p-4 rounded border border-gray-200">
                          <p className="text-gray-600 text-sm">Loading bullet points...</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">✅ 5 bullets • ✅ Benefits-focused • ✅ Conversion-optimized</p>
                  </div>

                  {/* Product Description Section */}
                  {highlights && highlights.length > 6 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-orange-500">📄</span> Your Product Description
                      </h4>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-gray-800 text-sm leading-relaxed">
                          {highlights[6]} {/* Assuming description is at index 6 */}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">✅ SEO-optimized • ✅ Trust-building • ✅ Conversion-focused</p>
                      </div>
                    </div>
                  )}

                  {/* Additional Recommendations */}
                  {highlights && highlights.length > 7 && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">📋 Additional Recommendations</h4>
                      <div className="space-y-2">
                        {highlights.slice(7).map((recommendation, index) => (
                          <div key={index} className="flex items-start gap-3 p-2 bg-white rounded border border-gray-200">
                            <span className="text-gray-500 font-bold text-xs mt-1">•</span>
                            <p className="text-gray-700 text-sm leading-relaxed">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* What You'll Get */}
                <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-6 border border-orange-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Complete Amazon Listing Pack</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-orange-500">📝</span> Optimized Title
                      </h4>
                      <p className="text-sm text-gray-600">IDQ-compliant title with brand and key features</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-orange-500">🎯</span> Bullet Points
                      </h4>
                      <p className="text-sm text-gray-600">5 conversion-focused bullet points</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-orange-500">📄</span> Description
                      </h4>
                      <p className="text-sm text-gray-600">SEO-optimized product description</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Create Your Amazon Listing</h3>
                <p className="text-gray-600 mb-6">
                  Enter a product URL above to get your complete Amazon listing optimization analysis and recommendations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">🎯 Title Optimization</h4>
                    <p className="text-sm text-gray-600">IDQ-compliant titles that rank and convert</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">📝 Bullet Points</h4>
                    <p className="text-sm text-gray-600">Conversion-focused product features</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">🔍 Keywords</h4>
                    <p className="text-sm text-gray-600">Strategic keyword placement</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* CTA Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {hasDetailedAnalysis ? "Ready to Get Your Complete Amazon Listing?" : "Ready to Launch on Amazon?"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {hasDetailedAnalysis 
                    ? "Get your complete Amazon listing with optimized title, bullet points, description, and keyword strategy delivered to your email."
                    : "Enter a product URL above to get your complete Amazon listing optimization analysis and recommendations."
                  }
                </p>
                
                {hasDetailedAnalysis && (
                  <>
                    <CTAButton
                      variant="primary"
                      size="lg"
                      text="get my complete amazon listing"
                      onClick={onUnlock}
                      className="px-8"
                      disabled={isLoading}
                    />
                    
                    <p className="text-sm text-gray-500 mt-3">
                      No credit card required • Instant delivery • 100% free
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

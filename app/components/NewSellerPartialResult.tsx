'use client';

import React from 'react';
import UnifiedCTA from '@/components/UnifiedCTA';

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
  console.log('Component render state:', { isLoading, hasDetailedAnalysis: highlights && highlights.length > 0 && !highlights.some(h => h.includes('AI analysis in progress') || h.includes('Ready to analyze')) });
  
  // Extract detailed analysis from highlights if available
  const hasDetailedAnalysis = highlights && highlights.length > 0 && 
    !highlights.some(h => h.includes('AI analysis in progress') || h.includes('Ready to analyze'));
  
  
  return (
    <section className="py-16 bg-[#0B0B0C]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B0B0C] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] px-4 sm:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white break-words">
                  {hasDetailedAnalysis ? "Your Amazon Listing Analysis" : "Amazon Listing Creator"}
                </h2>
                {productUrl ? (
                  <p className="text-white/90 mt-1 text-sm break-all">
                    Analyzing: {productUrl}
                  </p>
                ) : manualData ? (
                  <p className="text-white/90 mt-1 text-sm">
                    Product: {manualData.category} - {manualData.description.substring(0, 50)}...
                  </p>
                ) : (
                  <p className="text-white/90 mt-1 text-sm">
                    Enter a product URL to get started
                  </p>
                )}
              </div>
              <div className="text-center sm:text-right flex-shrink-0">
                {isLoading ? (
                  <>
                    <div className="text-2xl sm:text-3xl font-bold text-white">Analyzing...</div>
                    <div className="text-white/90 text-sm">Scraping & AI processing</div>
                  </>
                ) : hasDetailedAnalysis ? (
                  <>
                    <div className="text-2xl sm:text-3xl font-bold text-white">Analysis Complete</div>
                    <div className="text-white/90 text-sm">Ready for Amazon</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl sm:text-3xl font-bold text-white">Ready</div>
                    <div className="text-white/90 text-sm">Enter URL above</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7D2B] mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-white mb-2">Analyzing Your Product</h3>
                <p className="text-white/90">Scraping product data and generating Amazon listing recommendations...</p>
              </div>
            ) : hasDetailedAnalysis ? (
              <div className="space-y-6">
                {/* Product Analysis Summary */}
                <div className="bg-gradient-to-r from-[#296AFF]/10 to-[#FF7D2B]/10 rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Your Amazon Listing Analysis</h3>
                  <p className="text-white/90 mb-4">
                    Based on your product page analysis, here&apos;s what we found and how to optimize it for Amazon&apos;s listing requirements:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0B0B0C] rounded-lg p-4 border border-white/10">
                      <h4 className="font-medium text-white mb-2">Current Status</h4>
                      <ul className="text-sm text-white/90 space-y-1">
                        <li>• Product data scraped successfully</li>
                        <li>• Amazon requirements analyzed</li>
                        <li>• Amazon listing recommendations ready</li>
                      </ul>
                    </div>
                    <div className="bg-[#0B0B0C] rounded-lg p-4 border border-white/10">
                      <h4 className="font-medium text-white mb-2">Next Steps</h4>
                      <ul className="text-sm text-white/90 space-y-1">
                        <li>• Review optimized title & bullets</li>
                        <li>• Get complete listing strategy</li>
                        <li>• Receive keyword recommendations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Generated Amazon Listing Content */}
                <div className="bg-[#0B0B0C] rounded-lg border border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Your Generated Amazon Listing</h3>
                  
                  {/* Title Section */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-[#296AFF]/10 to-[#FF7D2B]/10 rounded-lg border border-white/10">
                    <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                      Your Amazon Title
                    </h4>
                    <div className="bg-[#0B0B0C] p-4 rounded border border-white/10">
                      <p className="text-white/90 font-medium text-lg leading-relaxed">
                        {highlights && highlights.length > 0 ? highlights[0] : "Loading title..."}
                      </p>
                      <p className="text-xs text-white/60 mt-2">Amazon-compliant • Brand included • Keywords optimized</p>
                    </div>
                  </div>

                  {/* Bullet Points Section */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-[#FF7D2B]/10 to-[#296AFF]/10 rounded-lg border border-white/10">
                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                      Your Bullet Points
                    </h4>
                    <div className="space-y-3">
                      {highlights && highlights.length > 1 ? highlights.slice(1, 6).map((bullet, index) => (
                        <div key={index} className="bg-[#0B0B0C] p-4 rounded border border-white/10 shadow-sm">
                          <div className="flex items-start gap-3">
                            <span className="text-[#FF7D2B] font-bold text-lg mt-0.5">{index + 1}</span>
                            <p className="text-white/90 text-sm leading-relaxed font-medium">{bullet}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="bg-[#0B0B0C] p-4 rounded border border-white/10">
                          <p className="text-white/90 text-sm">Loading bullet points...</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-white/60 mt-3">5 bullets • Benefits-focused • Conversion-optimized</p>
                  </div>

                  {/* Product Description Section */}
                  {highlights && highlights.length > 6 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-[#296AFF]/10 to-[#FF7D2B]/10 rounded-lg border border-white/10">
                      <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                        Your Product Description
                      </h4>
                      <div className="bg-[#0B0B0C] p-4 rounded border border-white/10">
                        <p className="text-white/90 text-sm leading-relaxed">
                          {highlights[6]} {/* Assuming description is at index 6 */}
                        </p>
                        <p className="text-xs text-white/60 mt-2">SEO-optimized • Trust-building • Conversion-focused</p>
                      </div>
                    </div>
                  )}

                  {/* Additional Recommendations */}
                  {highlights && highlights.length > 7 && (
                    <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                      <h4 className="font-medium text-white mb-3">Additional Recommendations</h4>
                      <div className="space-y-2">
                        {highlights.slice(7).map((recommendation, index) => (
                          <div key={index} className="flex items-start gap-3 p-2 bg-[#0B0B0C] rounded border border-white/10">
                            <span className="text-white/60 font-bold text-xs mt-1">•</span>
                            <p className="text-white/90 text-sm leading-relaxed">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* What You'll Get */}
                <div className="bg-gradient-to-r from-[#FF7D2B]/10 to-[#296AFF]/10 rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Complete Amazon Listing Pack</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#0B0B0C] rounded-lg p-4 border border-white/10">
                      <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                        Optimized Title
                      </h4>
                      <p className="text-sm text-white/90">Amazon-compliant title with brand and key features</p>
                    </div>
                    <div className="bg-[#0B0B0C] rounded-lg p-4 border border-white/10">
                      <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                        Bullet Points
                      </h4>
                      <p className="text-sm text-white/90">5 conversion-focused bullet points</p>
                    </div>
                    <div className="bg-[#0B0B0C] rounded-lg p-4 border border-white/10">
                      <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                        Description
                      </h4>
                      <p className="text-sm text-white/90">SEO-optimized product description</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-white/40 text-6xl mb-4"></div>
                <h3 className="text-lg font-medium text-white mb-2">Ready to Create Your Amazon Listing</h3>
                <p className="text-white/90 mb-6">
                  Enter a product URL above to get your complete Amazon listing optimization analysis and recommendations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-medium text-white mb-2">Title Optimization</h4>
                    <p className="text-sm text-white/90">Amazon-compliant titles that rank and convert</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-medium text-white mb-2">Bullet Points</h4>
                    <p className="text-sm text-white/90">Conversion-focused product features</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-medium text-white mb-2">Keywords</h4>
                    <p className="text-sm text-white/90">Strategic keyword placement</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* CTA Section */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {hasDetailedAnalysis ? "Ready to Get Your Complete Amazon Listing?" : "Ready to Launch on Amazon?"}
                </h3>
                <p className="text-white/90 mb-6">
                  {hasDetailedAnalysis 
                    ? "Get your complete Amazon listing with optimized title, bullet points, description, and keyword strategy delivered to your email."
                    : "Enter a product URL above to get your complete Amazon listing optimization analysis and recommendations."
                  }
                </p>
                
                {hasDetailedAnalysis && (
                  <>
                    <UnifiedCTA
                      variant="primary"
                      size="lg"
                      text="get my complete amazon listing"
                      onClick={onUnlock}
                      className="px-8"
                      disabled={isLoading}
                    />
                    
                    <p className="text-sm text-white/60 mt-3">
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

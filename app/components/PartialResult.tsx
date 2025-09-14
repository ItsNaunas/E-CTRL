'use client';

import { useEffect, useState } from 'react';
import UnifiedCTA from '@/components/UnifiedCTA';

interface PartialResultProps {
  score?: number; // Make score optional for initial state
  highlights: string[];
  onUnlock: () => void;
  isLoading?: boolean;
  detailedAnalysis?: any;
}

export default function PartialResult({ score, highlights, onUnlock, isLoading = false, detailedAnalysis }: PartialResultProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Track partial view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'partial_view', {
        event_category: 'engagement',
        event_label: 'partial_results'
      });
    }

    // Only animate score if we have a valid score
    if (score !== undefined) {
      // Animate score from 0 to target
      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const increment = score / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setAnimatedScore(score);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [score]);

  const handleUnlock = () => {
    // Track unlock click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'partial_unlock_click', {
        event_category: 'engagement',
        event_label: 'unlock_full_report'
      });
    }
    onUnlock();
  };


  return (
    <section className="py-16 bg-[#0B0B0C]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Your Amazon Listing Analysis
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Here&apos;s what our AI found. Get your complete audit report with detailed recommendations.
          </p>
        </div>

        <div className="bg-[#0B0B0C] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          {/* Score Header */}
          <div className="bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] px-8 py-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span className="ml-2">Analyzing...</span>
                  </div>
                ) : score === undefined ? (
                  <span>Ready</span>
                ) : (
                  `${animatedScore}/100`
                )}
              </div>
              <div className="text-white/90 text-lg">
                {isLoading ? 'AI Analysis in Progress' : score === undefined ? 'Enter ASIN to Start' : 'Your Listing Score'}
              </div>
            </div>
          </div>

          {/* Error State */}
          {detailedAnalysis?.error && (
            <div className="p-8">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-red-400">
                      {detailedAnalysis.errorCode === 'INVALID_INPUT' || detailedAnalysis.errorCode === 'INVALID_ASIN' 
                        ? 'Invalid ASIN' 
                        : detailedAnalysis.errorCode === 'PRODUCT_NOT_FOUND'
                        ? 'Product Not Found'
                        : 'Analysis Error'}
                    </h3>
                  </div>
                </div>
                <div className="text-red-300">
                  <p>{detailedAnalysis.error}</p>
                  <p className="mt-2 text-sm text-red-400">
                    Please check your ASIN and try again. Make sure you&apos;re using a valid 10-character ASIN or Amazon product URL.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Key Findings */}
          {!detailedAnalysis?.error && (
            <div className="p-8">
              <h3 className="text-xl font-semibold text-white mb-6">
                Key Findings:
              </h3>
              
              <div className="space-y-4 mb-8">
                {isLoading ? (
                // Loading skeleton for highlights
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#296AFF]/20 flex items-center justify-center mt-0.5">
                      <span className="text-[#296AFF] text-sm font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <div className="h-6 bg-white/10 rounded animate-pulse flex-1"></div>
                  </div>
                ))
              ) : (
                highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#296AFF]/20 flex items-center justify-center mt-0.5">
                      <span className="text-[#296AFF] text-sm font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-white/90 text-lg">
                      {highlight}
                    </p>
                  </div>
                ))
              )}
            </div>


            {/* Unlock CTA */}
            <div className="text-center pt-6 border-t border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">
                Want to see your complete audit report?
              </h4>
              <p className="text-white/90 mb-6 max-w-md mx-auto">
                Get detailed recommendations, keyword analysis, and optimization strategies.
              </p>
              
              <UnifiedCTA
                variant="primary"
                size="lg"
                text={isLoading ? "AI Analysis in Progress..." : "unlock my full report now"}
                onClick={handleUnlock}
                className="mb-4"
                disabled={isLoading}
              />
              
              <p className="text-sm text-white/60" data-testid="microcopy-free">
                Free forever • No credit card required • Secure & private
              </p>
            </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

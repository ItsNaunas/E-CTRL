'use client';

import { useEffect } from 'react';
import CTAButton from './CTAButton';

interface PartialResultProps {
  score: number;
  highlights: string[];
  onUnlock: () => void;
}

export default function PartialResult({ score, highlights, onUnlock }: PartialResultProps) {
  useEffect(() => {
    // Track partial view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'partial_view', {
        event_category: 'engagement',
        event_label: 'partial_results'
      });
    }
  }, []);

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
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Amazon Listing Analysis
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here&apos;s what our AI found. Get your complete audit report with detailed recommendations.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Score Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {score}/100
              </div>
              <div className="text-blue-100 text-lg">
                Your Listing Score
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Key Findings:
            </h3>
            
            <div className="space-y-4 mb-8">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-gray-700 text-lg">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>

            {/* Unlock CTA */}
            <div className="text-center pt-6 border-t border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Want to see your complete audit report?
              </h4>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get detailed recommendations, keyword analysis, and optimization strategies.
              </p>
              
              <CTAButton
                variant="primary"
                size="lg"
                text="unlock"
                onClick={handleUnlock}
                className="mb-4"
              />
              
              <p className="text-sm text-gray-500" data-testid="microcopy-free">
                Free forever • No credit card required • Secure & private
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

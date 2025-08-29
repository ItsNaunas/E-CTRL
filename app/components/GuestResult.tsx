'use client';

import CTAButton from '@/components/CTAButton';

interface GuestResultProps {
  mode: 'audit' | 'create';
  email: string;
  onUpgrade: () => void;
}

export default function GuestResult({ mode, email, onUpgrade }: GuestResultProps) {
  const isAuditMode = mode === 'audit';
  
  // Mock guest data - limited insights
  const guestData = isAuditMode ? {
    score: 74,
    quickWins: [
      "Improve bullet point clarity for better conversion",
      "Add missing keyword 'eco-friendly' to title",
      "Optimize main image size (currently 85% coverage)"
    ],
    blurredImages: [
      { type: "Main Image", issue: "Size optimization needed" },
      { type: "Lifestyle Shot", issue: "Missing product context" }
    ],
    checklistPreview: [
      { item: "Title optimization", status: "needs work" },
      { item: "Image quality", status: "good" }
    ]
  } : {
    quickWins: [
      "Your product has strong market potential",
      "Key benefits identified for listing optimization",
      "Competitive analysis shows opportunity for differentiation"
    ],
    blurredImages: [
      { type: "Main Product Image", status: "ready to create" },
      { type: "Lifestyle Image", status: "concept ready" }
    ],
    checklistPreview: [
      { item: "Product positioning", status: "optimized" },
      { item: "Target audience", status: "identified" }
    ]
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-2xl font-bold text-white">
                {isAuditMode ? 'Your Audit Preview' : 'Your Listing Preview'}
              </h2>
              <p className="text-blue-100 mt-2">
                Sent to: {email}
              </p>
              <div className="mt-3 bg-blue-400/30 rounded-lg px-4 py-2 inline-block">
                <span className="text-blue-100 text-sm font-medium">Guest Access - Limited Preview</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Quick Wins Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🎯 Quick Wins ({guestData.quickWins.length} of many)
              </h3>
              <div className="space-y-3">
                {guestData.quickWins.map((win, index) => (
                  <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{win}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">
                <span className="font-medium">Upgrade to see all {isAuditMode ? '15+ insights' : '20+ recommendations'}</span>
              </p>
            </div>

            {/* Blurred Images Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                📸 Image Recommendations (Preview)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guestData.blurredImages.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📸</span>
                        <span className="font-medium text-gray-900">{image.type}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {isAuditMode ? image.issue : image.status}
                      </p>
                      
                      {/* Blurred/Watermarked Preview */}
                      <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-32 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gray-400/20 backdrop-blur-sm"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-3xl mb-2">🔒</div>
                          <p className="text-xs text-gray-600 font-medium">PREVIEW ONLY</p>
                          <p className="text-xs text-gray-500">Upgrade for full access</p>
                        </div>
                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-gray-300 text-6xl font-bold transform -rotate-45 opacity-20">
                            PREVIEW
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">
                <span className="font-medium">Upgrade to see all {isAuditMode ? '6 detailed image recommendations' : '6 optimized images'}</span>
              </p>
            </div>

            {/* Checklist Preview */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                ✅ Action Checklist (Preview)
              </h3>
              <div className="space-y-3">
                {guestData.checklistPreview.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                      item.status === 'good' || item.status === 'optimized' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {item.status === 'good' || item.status === 'optimized' ? '✓' : '!'}
                    </span>
                    <span className="text-gray-700">{item.item}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'good' || item.status === 'optimized'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">
                <span className="font-medium">Upgrade to see complete checklist with effort/impact ratings</span>
              </p>
            </div>

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white text-center">
              <h3 className="text-xl font-bold mb-2">
                Ready for the Full Experience?
              </h3>
              <p className="text-orange-100 mb-4">
                {isAuditMode 
                  ? 'Get your complete audit report with detailed insights, sharp image recommendations, and actionable checklist.'
                  : 'Get your complete listing with 6 optimized images, SEO-optimized copy, and step-by-step guide.'
                }
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-lg font-bold">Complete Report</div>
                  <div className="text-orange-100 text-sm">All insights & details</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-lg font-bold">PDF Export</div>
                  <div className="text-orange-100 text-sm">Download & share</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-lg font-bold">Follow-ups</div>
                  <div className="text-orange-100 text-sm">Automated insights</div>
                </div>
              </div>

              <CTAButton
                variant="secondary"
                size="lg"
                text="upgrade to full account now"
                onClick={onUpgrade}
                className="px-8"
              />
              
              <p className="text-sm text-orange-100 mt-3">
                Free account • No credit card required • Instant access
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

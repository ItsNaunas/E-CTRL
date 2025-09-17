'use client';

import UnifiedCTA from '@/components/UnifiedCTA';

interface GuestResultProps {
  mode: 'audit' | 'create';
  email: string;
  onUpgrade: () => void;
}

export default function GuestResult({ mode, email, onUpgrade }: GuestResultProps) {
  const isAuditMode = mode === 'audit';
  
  // Accurate guest result content based on actual tool functionality
  const guestData = {
    quickWins: [
      "Amazon listing analysis completed",
      "Amazon compliance check finished", 
      "Optimization recommendations ready"
    ],
    auditInsights: [
      { type: "Title Analysis", description: "SEO and keyword optimization insights" },
      { type: "Bullet Points Review", description: "Conversion optimization recommendations" }
    ],
    checklistPreview: [
      { item: "Listing quality assessment", status: "completed" },
      { item: "Optimization report", status: "ready" }
    ]
  };

  return (
    <section className="py-16 bg-[#0B0B0C]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B0B0C] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] px-8 py-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {isAuditMode ? 'Your Amazon Audit Preview' : 'Your Listing Analysis Preview'}
              </h2>
              <p className="text-white/90 mt-2">
                Sent to: {email}
              </p>
              <div className="mt-3 bg-white/10 rounded-lg px-4 py-2 inline-block">
                <span className="text-white/90 text-sm font-medium">Guest Access - Limited Preview</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Quick Wins Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Analysis Results ({guestData.quickWins.length} of many)
              </h3>
              <div className="space-y-3">
                {guestData.quickWins.map((win, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start gap-3">
                      <span className="text-[#FF7D2B] mt-1">✓</span>
                      <span className="text-white/90">{win}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60 mt-3 text-center">
                <span className="font-medium">Upgrade to see all {isAuditMode ? '15+ audit insights' : '20+ optimization recommendations'}</span>
              </p>
            </div>

            {/* Audit Insights Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Audit Insights (Preview)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guestData.auditInsights.map((insight, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl"></span>
                        <span className="font-medium text-white">{insight.type}</span>
                      </div>
                      <p className="text-sm text-white/70 mb-3">
                        {insight.description}
                      </p>
                      
                      {/* Blurred/Watermarked Preview */}
                      <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-lg h-32 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-3xl mb-2"></div>
                          <p className="text-xs text-white/70 font-medium">PREVIEW ONLY</p>
                          <p className="text-xs text-white/50">Upgrade for full access</p>
                        </div>
                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-white/10 text-6xl font-bold transform -rotate-45 opacity-20">
                            PREVIEW
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60 mt-3 text-center">
                <span className="font-medium">Upgrade to see all {isAuditMode ? 'detailed listing optimization recommendations' : 'complete readiness checklist'}</span>
              </p>
            </div>

            {/* Checklist Preview */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Action Checklist (Preview)
              </h3>
              <div className="space-y-3">
                {guestData.checklistPreview.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                      item.status === 'good' || item.status === 'optimized' 
                        ? 'bg-[#FF7D2B]/20 text-[#FF7D2B]' 
                        : 'bg-[#296AFF]/20 text-[#296AFF]'
                    }`}>
                      {item.status === 'good' || item.status === 'optimized' ? '✓' : '!'}
                    </span>
                    <span className="text-white/90">{item.item}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'good' || item.status === 'optimized'
                        ? 'bg-[#FF7D2B]/20 text-[#FF7D2B]'
                        : 'bg-[#296AFF]/20 text-[#296AFF]'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60 mt-3 text-center">
                <span className="font-medium">Upgrade to see complete checklist with effort/impact ratings</span>
              </p>
            </div>

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-r from-[#FF7D2B] to-[#296AFF] rounded-xl p-6 text-white text-center">
              <h3 className="text-xl font-bold mb-2">
                Ready for the Full Experience?
              </h3>
              <p className="text-white/90 mb-4">
                {isAuditMode 
                  ? 'Get your complete Amazon audit report with detailed listing quality analysis, optimization recommendations, and actionable checklist.'
                  : 'Get your complete listing readiness assessment, SEO-optimized copy recommendations, and step-by-step launch guide.'
                }
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <div className="text-lg font-bold">Complete Report</div>
                  <div className="text-white/80 text-sm">All insights & details</div>
                </div>
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <div className="text-lg font-bold">PDF Export</div>
                  <div className="text-white/80 text-sm">Download & share</div>
                </div>
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <div className="text-lg font-bold">Follow-ups</div>
                  <div className="text-white/80 text-sm">Automated insights</div>
                </div>
              </div>

              <UnifiedCTA
                variant="secondary"
                size="lg"
                text="upgrade to full account now"
                onClick={onUpgrade}
                className="px-8"
              />
              
              <p className="text-sm text-white/80 mt-3">
                Free account • No credit card required • Instant access
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

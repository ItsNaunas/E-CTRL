'use client';

export default function TrustBar() {
  return (
    <section className="py-8 bg-white border-b border-gray-100" data-testid="trustbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
          
          {/* Trust Signals */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm font-semibold">✓</span>
            </div>
            <span className="text-sm text-gray-600">Trusted by sellers in 10+ countries</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-semibold">🔒</span>
            </div>
            <span className="text-sm text-gray-600">Secure & private</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-sm font-semibold">⚡</span>
            </div>
            <span className="text-sm text-gray-600">Instant results</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-sm font-semibold">💯</span>
            </div>
            <span className="text-sm text-gray-600">100% free forever</span>
          </div>
          
        </div>
      </div>
    </section>
  );
}

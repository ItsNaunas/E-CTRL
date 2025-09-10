'use client';

import { useState } from 'react';
import CTAButton from '@/components/CTAButton';

interface NewSellerHeroProps {
  onUrlSubmit: (url: string) => void;
  onManualSubmit: (data: {
    category: string;
    description: string;
    keywords: string[];
    fulfilmentIntent: string;
  }) => void;
}

export default function NewSellerHero({ onUrlSubmit, onManualSubmit }: NewSellerHeroProps) {
  const [productUrl, setProductUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputMode, setInputMode] = useState<'url' | 'manual'>('url');
  
  // Manual input fields
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [fulfilmentIntent, setFulfilmentIntent] = useState('FBA');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (inputMode === 'url') {
      // URL validation
      try {
        new URL(productUrl);
      } catch {
        setError('Please enter a valid product URL');
        setIsSubmitting(false);
        return;
      }
      
      // Track listing creation start
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'listing_creation_start', {
          event_category: 'engagement',
          event_label: 'new_seller_url_form'
        });
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onUrlSubmit(productUrl);
    } else {
      // Manual input validation
      if (!category || !description || !keywords) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
      if (keywordsArray.length < 2) {
        setError('Please provide at least 2 keywords');
        setIsSubmitting(false);
        return;
      }

      // Track listing creation start
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'listing_creation_start', {
          event_category: 'engagement',
          event_label: 'new_seller_manual_form'
        });
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onManualSubmit({
        category,
        description,
        keywords: keywordsArray,
        fulfilmentIntent: fulfilmentIntent as 'FBA' | 'FBM' | 'Unsure'
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <section className="relative py-16 md:py-20 after:content-[''] after:absolute after:inset-0 after:-z-10 after:bg-[radial-gradient(60%_40%_at_50%_0%,rgba(0,122,255,0.25),transparent_60%)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-[#007AFF] to-[#FF6B00] bg-clip-text text-transparent">
              Create Your Amazon Listing from Your Website — Launch Faster
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl">
              Enter your product landing page URL to generate an optimized Amazon listing with images, title, and description.
            </p>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* Input Mode Toggle */}
              <div className="flex space-x-4 mb-6">
                <button
                  type="button"
                  onClick={() => setInputMode('url')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    inputMode === 'url'
                      ? 'bg-gradient-to-r from-[#007AFF] to-[#FF6B00] text-white'
                      : 'border border-white/15 text-white/90 hover:border-white/40 hover:bg-white/5'
                  }`}
                >
                  Product Link
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('manual')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    inputMode === 'manual'
                      ? 'bg-gradient-to-r from-[#007AFF] to-[#FF6B00] text-white'
                      : 'border border-white/15 text-white/90 hover:border-white/40 hover:bg-white/5'
                  }`}
                >
                  Manual Input
                </button>
              </div>

              {inputMode === 'url' ? (
                <div>
                  <label htmlFor="product-url-input" className="block text-sm font-medium text-white mb-2">
                    Product Website URL
                  </label>
                  <input
                    id="product-url-input"
                    data-testid="new-seller-input"
                    type="url"
                    value={productUrl}
                    onChange={(e) => {
                      setProductUrl(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="https://yourwebsite.com/product-page"
                    className={`block w-full rounded-xl bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-[#007AFF]/50 focus:ring-2 focus:ring-[#007AFF]/30 px-4 py-3 transition outline-none sm:text-lg ${
                      error 
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' 
                        : ''
                    }`}
                    required
                    aria-describedby={error ? "url-error" : "url-help"}
                    aria-invalid={!!error}
                  />
                  <p className="mt-2 text-sm text-white/70">
                    We&apos;ll analyze your product page to create the perfect Amazon listing
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                      Product Category *
                    </label>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="e.g., Home & Garden, Electronics, Beauty"
                      className={`block w-full rounded-xl bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-[#007AFF]/50 focus:ring-2 focus:ring-[#007AFF]/30 px-4 py-3 transition outline-none ${
                        error 
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' 
                          : ''
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                      Product Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Describe your product, its features, and benefits..."
                      rows={3}
                      className={`block w-full rounded-xl bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-[#007AFF]/50 focus:ring-2 focus:ring-[#007AFF]/30 px-4 py-3 transition outline-none ${
                        error 
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' 
                          : ''
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-white mb-2">
                      Keywords (comma-separated) *
                    </label>
                    <input
                      id="keywords"
                      name="keywords"
                      type="text"
                      value={keywords}
                      onChange={(e) => {
                        setKeywords(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="eco-friendly, sustainable, organic, natural"
                      className={`block w-full rounded-xl bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-[#007AFF]/50 focus:ring-2 focus:ring-[#007AFF]/30 px-4 py-3 transition outline-none ${
                        error 
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' 
                          : ''
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="fulfilment" className="block text-sm font-medium text-white mb-2">
                      Fulfilment Method
                    </label>
                    <select
                      id="fulfilment"
                      name="fulfilment"
                      value={fulfilmentIntent}
                      onChange={(e) => setFulfilmentIntent(e.target.value)}
                      className="block w-full rounded-xl bg-white/5 text-white border border-white/10 focus:border-[#007AFF]/50 focus:ring-2 focus:ring-[#007AFF]/30 px-4 py-3 transition outline-none"
                    >
                      <option value="FBA">FBA (Fulfilled by Amazon)</option>
                      <option value="FBM">FBM (Fulfilled by Merchant)</option>
                      <option value="Unsure">Not sure yet</option>
                    </select>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}
              
              <CTAButton
                type="submit"
                variant="primary"
                size="lg"
                text="create my amazon listing now"
                fullWidth
                className="w-full"
                disabled={isSubmitting}
                data-testid="new-seller-cta"
              />
              
              <p id="url-help" className="text-sm text-white/70 text-center" data-testid="microcopy-free">
                Get 6 optimized images + complete listing. 100% free.
              </p>
            </form>
          </div>
          
          {/* Right Column - iPad Mockup */}
          <div className="relative flex justify-center items-center">
            {/* iPad Mockup Image */}
            <div className="relative animate-fade-in-up">
              <img 
                src="/ipad-mockup.png" 
                alt="iPad showing Amazon listing creation" 
                className="w-80 h-96 object-contain transform scale-x-[-1]"
              />
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-[#007AFF] to-[#FF6B00] rounded-full animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-6 h-6 bg-gradient-to-r from-[#FF6B00] to-[#007AFF] rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

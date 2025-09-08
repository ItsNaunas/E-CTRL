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
    <section className="bg-background py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Create Your Amazon Listing from Your Website — Launch Faster
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Enter your product landing page URL to generate an optimized Amazon listing with images, title, and description.
            </p>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* Input Mode Toggle */}
              <div className="flex space-x-4 mb-6">
                <button
                  type="button"
                  onClick={() => setInputMode('url')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    inputMode === 'url'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Product Link
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('manual')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    inputMode === 'manual'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Manual Input
                </button>
              </div>

              {inputMode === 'url' ? (
                <div>
                  <label htmlFor="product-url-input" className="block text-sm font-medium text-foreground mb-2">
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
                    className={`block w-full rounded-lg border px-4 py-3 text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-lg ${
                      error 
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                        : 'border-border bg-input focus:border-accent focus:ring-accent'
                    }`}
                    required
                    aria-describedby={error ? "url-error" : "url-help"}
                    aria-invalid={!!error}
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    We&apos;ll analyze your product page to create the perfect Amazon listing
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
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
                      className={`block w-full rounded-lg border px-4 py-3 text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        error 
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                          : 'border-border bg-input focus:border-accent focus:ring-accent'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
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
                      className={`block w-full rounded-lg border px-4 py-3 text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        error 
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                          : 'border-border bg-input focus:border-accent focus:ring-accent'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-foreground mb-2">
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
                      className={`block w-full rounded-lg border px-4 py-3 text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        error 
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                          : 'border-border bg-input focus:border-accent focus:ring-accent'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="fulfilment" className="block text-sm font-medium text-foreground mb-2">
                      Fulfilment Method
                    </label>
                    <select
                      id="fulfilment"
                      name="fulfilment"
                      value={fulfilmentIntent}
                      onChange={(e) => setFulfilmentIntent(e.target.value)}
                      className="block w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-accent focus:ring-accent"
                    >
                      <option value="FBA">FBA (Fulfilled by Amazon)</option>
                      <option value="FBM">FBM (Fulfilled by Merchant)</option>
                      <option value="Unsure">Not sure yet</option>
                    </select>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-600" role="alert">
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
              
              <p id="url-help" className="text-sm text-muted-foreground text-center" data-testid="microcopy-free">
                Get 6 optimized images + complete listing. 100% free.
              </p>
            </form>
          </div>
          
          {/* Right Column - Preview */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              {/* Amazon Listing Preview */}
              <div className="relative">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg">Amazon Listing Preview</h3>
                    <div className="text-white text-sm">Ready to Launch</div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-orange-600 mb-2">6 Images</div>
                    <div className="text-sm text-gray-600">Optimized for Conversion</div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What You&apos;ll Get:</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">📸</span>
                        <span className="text-sm text-gray-700">Main product image (85% frame)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">🎯</span>
                        <span className="text-sm text-gray-700">Lifestyle image in use</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">📊</span>
                        <span className="text-sm text-gray-700">Benefits infographic</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">📏</span>
                        <span className="text-sm text-gray-700">Product measurements</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">🔍</span>
                        <span className="text-sm text-gray-700">Cross-section anatomy</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Optimized Listing:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• SEO-optimized title structure</li>
                      <li>• 5-10 benefit-focused bullet points</li>
                      <li>• Keyword-rich product description</li>
                      <li>• Conversion-optimized copy</li>
                    </ul>
                  </div>
                </div>
                
                {/* Blur Overlay */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚀</div>
                    <p className="text-gray-600 font-medium">Enter your product URL to create listing</p>
                    <p className="text-sm text-gray-500 mt-1">Sample preview</p>
                  </div>
                </div>
              </div>
              
              {/* Watermark */}
              <div className="absolute top-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
                Sample Preview
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

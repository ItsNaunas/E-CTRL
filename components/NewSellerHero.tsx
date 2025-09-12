'use client';

import { useState } from 'react';
import Image from 'next/image';
import CTAButton from '@/components/CTAButton';
import ClientTestimonials from '@/components/ClientTestimonials';

interface NewSellerHeroProps {
  onUrlSubmit: (url: string) => void;
  onManualSubmit: (data: {
    category: string;
    description: string;
    keywords: string[];
    fulfilmentIntent: 'FBA' | 'FBM' | 'Unsure';
  }) => void;
  isAnalyzing?: boolean;
}

export default function NewSellerHero({ onUrlSubmit, onManualSubmit, isAnalyzing = false }: NewSellerHeroProps) {
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
    setIsSubmitting(true);
    setError('');
    
    try {
      if (inputMode === 'url') {
        if (!productUrl.trim()) {
          setError('Please enter a valid product URL');
          return;
        }
        
        // Track the event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'listing_creation_start', {
            event_category: 'engagement',
            event_label: 'new_seller_url_form'
          });
        }
        
        onUrlSubmit(productUrl);
      } else {
        // Manual input validation
        if (!category.trim() || !description.trim() || !keywords.trim()) {
          setError('Please fill in all required fields');
          return;
        }
        
        const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
        if (keywordsArray.length < 2) {
          setError('Please provide at least 2 keywords');
          return;
        }
        
        // Track the event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'listing_creation_start', {
            event_category: 'engagement',
            event_label: 'new_seller_manual_form'
          });
        }
        
        onManualSubmit({
          category: category.trim(),
          description: description.trim(),
          keywords: keywordsArray,
          fulfilmentIntent: fulfilmentIntent as 'FBA' | 'FBM' | 'Unsure'
        });
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <section className="relative min-h-[92vh] bg-gradient-to-br from-[#0a0b1a] via-[#0f1020] to-[#1a0c00] text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-gradient-to-br from-[#296AFF] to-[#1e3a8a] rounded-full blur-3xl opacity-25"></div>
      <div className="absolute bottom-0 right-0 w-[70vw] h-[70vw] bg-gradient-to-tl from-[#FF7D2B] to-[#dc2626] rounded-full blur-3xl opacity-25"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-gradient-to-r from-[#296AFF]/10 to-[#FF7D2B]/10 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(41,106,255,0.15)_0%,rgba(255,125,43,0.15)_50%,transparent_70%)]"></div>
      
      <div className="relative mx-auto w-full max-w-[1320px] px-6 py-6 md:py-20">
        <div className="grid items-center gap-8 lg:gap-16 lg:grid-cols-2">
            
            {/* Left: Content */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-[#296AFF] to-white bg-clip-text text-transparent">
                  Create Your Amazon Listing
                </span><br/>
                from Your Website<br/>
                <span className="bg-gradient-to-r from-white to-[#FF7D2B] bg-clip-text text-transparent">
                  Launch Faster
                </span>
              </h1>
              
              <p className="mt-6 max-w-2xl text-white/70 text-base lg:text-lg leading-relaxed">
                Enter your product landing page URL to generate an optimized Amazon listing with images, title, and description.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                {/* Input Mode Toggle */}
                <div className="flex justify-center mb-6">
                  <div className="flex bg-white/[0.08] ring-1 ring-white/25 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-full p-1">
                    <button
                      type="button"
                      onClick={() => setInputMode('url')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        inputMode === 'url'
                          ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20'
                          : 'text-white/70 hover:text-white hover:bg-white/8 hover:border-white/10 border border-transparent'
                      }`}
                    >
                      Product Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('manual')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        inputMode === 'manual'
                          ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20'
                          : 'text-white/70 hover:text-white hover:bg-white/8 hover:border-white/10 border border-transparent'
                      }`}
                    >
                      Manual Input
                    </button>
                  </div>
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
                      placeholder={(isAnalyzing || isSubmitting) ? "Analyzing your product..." : "https://yourwebsite.com/product-page"}
                      disabled={isAnalyzing || isSubmitting}
                      className={`block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none ${
                        error 
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' 
                          : ''
                      } ${
                        (isAnalyzing || isSubmitting) 
                          ? 'opacity-60 cursor-not-allowed' 
                          : ''
                      }`}
                      required
                      aria-describedby={error ? "url-error" : "url-help"}
                      aria-invalid={!!error}
                    />
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
                        className={`block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none ${
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
                        className={`block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none ${
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
                        className={`block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none ${
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
                        className="block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none"
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
                
                <button
                  type="submit"
                  disabled={isAnalyzing || isSubmitting}
                  className="relative inline-flex w-full h-[60px] rounded-[45px] p-[1.5px] bg-[linear-gradient(90deg,#296AFF_0%,#FF7D2B_100%)] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_8px_32px_rgba(41,106,255,0.3)] hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-[0_0_0_0_rgba(0,0,0,0)]"
                  data-testid="new-seller-cta"
                >
                  {/* Inner fill (pure black) */}
                  <span className="relative flex-1 rounded-[43.5px] bg-black text-white font-medium text-base leading-none inline-flex items-center justify-center select-none">
                    {(isAnalyzing || isSubmitting) ? 'analyzing...' : 'create my amazon listing now'}
                    {/* Optional glossy overlay from your Figma fill @ ~38% */}
                    <span className="pointer-events-none absolute inset-0 rounded-[43.5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_60%)] opacity-40" />
                  </span>
                </button>
                
              </form>

              {/* Client Testimonials - Social Proof (Mobile only) */}
              <div className="mt-6 md:hidden">
                <div className="text-center mb-3">
                  <p className="text-xs text-white/40">
                    Trusted by Amazon sellers worldwide
                  </p>
                </div>
                <ClientTestimonials />
              </div>
            </div>

            {/* Right: iPad Mockup - Hidden on mobile */}
            <div className="justify-self-end hidden md:block -mr-12 lg:-mr-24">
              <Image
                src="/ipad-mockup.png"
                alt="iPad showing Amazon listing creation"
                width={1012}
                height={600}
                className="block h-auto w-[1012px] max-w-[95vw]"
                draggable={false}
                priority
              />
            </div>
        </div>

        {/* Client Testimonials - Social Proof (Desktop only - below image) */}
        <div className="hidden md:block mt-8">
          <div className="text-center mb-3">
            <p className="text-xs text-white/40">
              Trusted by Amazon sellers worldwide
            </p>
          </div>
          <ClientTestimonials />
        </div>
      </div>
    </section>
  );
}
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import UnifiedCTA from '@/components/UnifiedCTA';
// import ClientTestimonials from '@/components/ClientTestimonials'; // HIDDEN FOR LATER USE

interface NewSellerHeroProps {
  onUrlSubmit: (url: string) => void;
  onManualSubmit: (data: {
    category: string;
    description: string;
    keywords: string[];
    fulfilmentIntent: 'FBA' | 'FBM' | 'Unsure';
    productName: string;
    brand: string;
    price: string;
    targetAudience: string;
    keyFeatures: string;
    benefits: string;
    dimensions: string;
    materials: string;
    useCase: string;
  }) => void;
  isAnalyzing?: boolean;
  forceManualMode?: boolean;
  onManualModeSet?: () => void;
}

export default function NewSellerHero({ onUrlSubmit, onManualSubmit, isAnalyzing = false, forceManualMode = false, onManualModeSet }: NewSellerHeroProps) {
  const [productUrl, setProductUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputMode, setInputMode] = useState<'url' | 'manual'>('url');
  const [isUrlCheckInProgress, setIsUrlCheckInProgress] = useState(false);
  
  // Auto-switch to manual mode when forced
  React.useEffect(() => {
    if (forceManualMode) {
      setInputMode('manual');
      setError('This website is not scannable automatically. Please fill in your product details manually below to get the same quality analysis.');
      setIsSubmitting(false); // Reset button loading state
      setIsUrlCheckInProgress(false); // Reset URL check flag
      onManualModeSet?.();
    }
  }, [forceManualMode, onManualModeSet]);
  
  // Manual input fields
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [fulfilmentIntent, setFulfilmentIntent] = useState('FBA');
  
  // Enhanced fields for better AI generation
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyFeatures, setKeyFeatures] = useState('');
  const [benefits, setBenefits] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [materials, setMaterials] = useState('');
  const [useCase, setUseCase] = useState('');
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;


  // Wizard navigation
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(productName.trim() && category.trim());
      case 2:
        return !!(description.trim() && keywords.trim());
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (inputMode === 'url') {
        if (!productUrl.trim()) {
          setError('Please enter a valid product URL');
          setIsSubmitting(false);
          return;
        }
        
        // Track the event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'listing_creation_start', {
            event_category: 'engagement',
            event_label: 'new_seller_url_form'
          });
        }
        
        // Submit URL to parent component
        setIsUrlCheckInProgress(true);
        onUrlSubmit(productUrl);
        // Don't set isSubmitting to false here - let parent handle loading state
      } else {
        // Don't proceed with manual submission if we're in the middle of a URL check
        if (isUrlCheckInProgress) {
          // URL check is still in progress, don't submit manual form yet
          setError('Please wait for the URL check to complete.');
          setIsSubmitting(false);
          return;
        }
        
        // Enhanced manual input validation
        if (!productName.trim() || !category.trim() || !description.trim() || !keywords.trim()) {
          setError('Please fill in all required fields (Product Name, Category, Description, Keywords)');
          setIsSubmitting(false);
          return;
        }
        
        const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
        if (keywordsArray.length < 2) {
          setError('Please provide at least 2 keywords');
          setIsSubmitting(false);
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
          fulfilmentIntent: fulfilmentIntent as 'FBA' | 'FBM' | 'Unsure',
          productName: productName.trim(),
          brand: brand.trim(),
          price: price.trim(),
          targetAudience: targetAudience.trim(),
          keyFeatures: keyFeatures.trim(),
          benefits: benefits.trim(),
          dimensions: dimensions.trim(),
          materials: materials.trim(),
          useCase: useCase.trim()
        });
        // Don't set isSubmitting to false here - let parent handle loading state
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
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
                Enter your product landing page URL to get a comprehensive Amazon listing readiness assessment with optimization recommendations.
              </p>

              <form onSubmit={handleSubmit} className={`mt-8 space-y-4 transition-all duration-300 ${
                (isAnalyzing || isSubmitting) ? 'opacity-90' : ''
              }`}>
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
                          ? 'opacity-60 cursor-not-allowed border-[#296AFF]/50' 
                          : ''
                      }`}
                      required
                      aria-describedby={error ? "url-error" : "url-help"}
                      aria-invalid={!!error}
                    />
                    <p className="mt-2 text-xs text-white/60" id="url-help">
                      Works best with static product pages. For JavaScript-heavy sites (Shopify, React apps), use Manual Input instead.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Wizard Progress */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        {Array.from({ length: totalSteps }, (_, i) => (
                          <div
                            key={i + 1}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              i + 1 <= currentStep 
                                ? 'bg-gradient-to-r from-[#296AFF] to-[#FF7D2B]' 
                                : 'bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-white/60">
                        Step {currentStep} of {totalSteps}
                      </span>
                    </div>

                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Basic Product Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-white mb-2">
                              Product Name *
                            </label>
                            <input
                              id="productName"
                              name="productName"
                              type="text"
                              value={productName}
                              onChange={(e) => {
                                setProductName(e.target.value);
                                if (error) setError('');
                              }}
                              placeholder="e.g., Premium Wireless Headphones"
                              className={`block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none ${
                                error 
                                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' 
                                  : ''
                              }`}
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="brand" className="block text-sm font-medium text-white mb-2">
                              Brand Name
                            </label>
                            <input
                              id="brand"
                              name="brand"
                              type="text"
                              value={brand}
                              onChange={(e) => {
                                setBrand(e.target.value);
                                if (error) setError('');
                              }}
                              placeholder="e.g., TechBrand, EcoLife"
                              className="block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              placeholder="e.g., Electronics, Home & Garden"
                              className={`block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none ${
                                error 
                                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' 
                                  : ''
                              }`}
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-white mb-2">
                              Target Price Range
                            </label>
                            <input
                              id="price"
                              name="price"
                              type="text"
                              value={price}
                              onChange={(e) => {
                                setPrice(e.target.value);
                                if (error) setError('');
                              }}
                              placeholder="e.g., $29.99, $50-100"
                              className="block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Product Details */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Product Details</h3>
                        
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
                            rows={4}
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
                            placeholder="wireless, bluetooth, noise-canceling, premium"
                            className={`block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none ${
                              error 
                                ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' 
                                : ''
                            }`}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="keyFeatures" className="block text-sm font-medium text-white mb-2">
                            Key Features & Benefits
                          </label>
                          <textarea
                            id="keyFeatures"
                            name="keyFeatures"
                            value={keyFeatures}
                            onChange={(e) => setKeyFeatures(e.target.value)}
                            placeholder="List key features and customer benefits..."
                            rows={3}
                            className="block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Additional Details */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Additional Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="targetAudience" className="block text-sm font-medium text-white mb-2">
                              Target Audience
                            </label>
                            <input
                              id="targetAudience"
                              name="targetAudience"
                              type="text"
                              value={targetAudience}
                              onChange={(e) => setTargetAudience(e.target.value)}
                              placeholder="e.g., Professionals, Students"
                              className="block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none"
                            />
                          </div>

                          <div>
                            <label htmlFor="useCase" className="block text-sm font-medium text-white mb-2">
                              Primary Use Case
                            </label>
                            <input
                              id="useCase"
                              name="useCase"
                              type="text"
                              value={useCase}
                              onChange={(e) => setUseCase(e.target.value)}
                              placeholder="e.g., Daily commuting, Home office"
                              className="block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="dimensions" className="block text-sm font-medium text-white mb-2">
                              Dimensions & Size
                            </label>
                            <input
                              id="dimensions"
                              name="dimensions"
                              type="text"
                              value={dimensions}
                              onChange={(e) => setDimensions(e.target.value)}
                              placeholder="e.g., 10x8x3 inches, 2.5 lbs"
                              className="block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none"
                            />
                          </div>

                          <div>
                            <label htmlFor="materials" className="block text-sm font-medium text-white mb-2">
                              Materials & Construction
                            </label>
                            <input
                              id="materials"
                              name="materials"
                              type="text"
                              value={materials}
                              onChange={(e) => setMaterials(e.target.value)}
                              placeholder="e.g., Premium aluminum, Eco-friendly"
                              className="block w-full rounded-[45px] bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="fulfilment" className="block text-sm font-medium text-white mb-2">
                            Fulfilment Method *
                          </label>
                          <select
                            id="fulfilment"
                            name="fulfilment"
                            value={fulfilmentIntent}
                            onChange={(e) => setFulfilmentIntent(e.target.value)}
                            className="block w-full rounded-[45px] bg-[#0B0B0C] backdrop-blur-sm text-white border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 px-6 py-4 transition outline-none appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 1.5rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1.5em 1.5em',
                              paddingRight: '3rem'
                            }}
                            required
                          >
                            <option value="" disabled className="bg-[#0B0B0C] text-white">Choose fulfillment method...</option>
                            <option value="FBA" className="bg-[#0B0B0C] text-white">FBA (Fulfilled by Amazon) - Amazon handles storage, packing & shipping</option>
                            <option value="FBM" className="bg-[#0B0B0C] text-white">FBM (Fulfilled by Merchant) - You handle storage, packing & shipping</option>
                            <option value="Unsure" className="bg-[#0B0B0C] text-white">Not sure yet - Get recommendations</option>
                          </select>
                          <p className="mt-2 text-xs text-white/60">
                            <strong>FBA:</strong> Higher fees but Amazon Prime eligibility and customer trust<br/>
                            <strong>FBM:</strong> Lower fees but you manage inventory and shipping yourself
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Wizard Navigation */}
                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`px-6 py-3 rounded-[45px] text-sm font-medium transition-all ${
                          currentStep === 1
                            ? 'text-white/40 cursor-not-allowed'
                            : 'text-white hover:text-white/80'
                        }`}
                      >
                        Previous
                      </button>

                      {currentStep < totalSteps ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!validateStep(currentStep)}
                          className={`px-8 py-3 rounded-[45px] text-sm font-medium transition-all ${
                            validateStep(currentStep)
                              ? 'bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] text-white hover:opacity-90'
                              : 'bg-white/20 text-white/40 cursor-not-allowed'
                          }`}
                        >
                          Next
                        </button>
                      ) : (
                        <div className="text-sm text-white/60">
                          Ready to create your listing
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                )}

                
                <UnifiedCTA
                  type="submit"
                  variant="primary"
                  size="lg"
                  text={(isAnalyzing || isSubmitting) ? 'analyzing...' : 'create my amazon listing now'}
                  disabled={isAnalyzing || isSubmitting}
                  loading={isAnalyzing || isSubmitting}
                  className="w-full"
                  data-testid="new-seller-cta"
                />
                
              </form>

              {/* Client Testimonials - Social Proof (Mobile only) - HIDDEN FOR LATER USE */}
              {/* <div className="mt-6 md:hidden">
                <div className="text-center mb-3">
                  <p className="text-xs text-white/40">
                    Trusted by Amazon sellers worldwide
                  </p>
                </div>
                <ClientTestimonials />
              </div> */}
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

        {/* Client Testimonials - Social Proof (Desktop only - below image) - HIDDEN FOR LATER USE */}
        {/* <div className="hidden md:block mt-8">
          <div className="text-center mb-3">
            <p className="text-xs text-white/40">
              Trusted by Amazon sellers worldwide
            </p>
          </div>
          <ClientTestimonials />
        </div> */}
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import UnifiedCTA from '@/components/UnifiedCTA';
import ClientTestimonials from '@/components/ClientTestimonials';

interface NewSellerHeroProps {
  onUrlSubmit: (url: string) => void;
  onManualSubmit: (data: {
    category: string;
    description: string;
    keywords: string[];
    name: string;
    email: string;
  }) => void;
  isAnalyzing?: boolean;
  forceManualMode?: boolean;
  onManualModeSet?: () => void;
}

export default function NewSellerHero({
  onUrlSubmit,
  onManualSubmit,
  isAnalyzing = false,
  forceManualMode = false,
  onManualModeSet
}: NewSellerHeroProps) {
  const [url, setUrl] = useState('');
  const [isManualMode, setIsManualMode] = useState(forceManualMode);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Manual input fields
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a product URL');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      onUrlSubmit(url.trim());
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Enhanced manual input validation
      if (!category.trim() || !description.trim() || !keywords.trim() || !name.trim() || !email.trim()) {
        setError('Please fill in all required fields (Category, Description, Keywords, Name, Email)');
        setIsSubmitting(false);
        return;
      }
      
      const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
      if (keywordsArray.length < 2) {
        setError('Please provide at least 2 keywords');
        setIsSubmitting(false);
        return;
      }
      
      onManualSubmit({
        category: category.trim(),
        description: description.trim(),
        keywords: keywordsArray,
        name: name.trim(),
        email: email.trim()
      });
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(category.trim() && description.trim());
      case 2:
        return !!(keywords.trim());
      case 3:
        return !!(name.trim() && email.trim());
      default:
        return false;
    }
  };

  const canProceed = validateStep(currentStep);

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0C] via-[#1a1a1a] to-[#0B0B0C]"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Create Your First
            <span className="block bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] bg-clip-text text-transparent">
              Amazon Listing
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Get a complete Amazon listing pack with optimized title, bullets, description, and keywords - 
            everything you need to launch successfully.
          </p>
        </div>

        {!isManualMode ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Step 1: Enter Your Product URL
            </h2>
            
            <form onSubmit={handleUrlSubmit} className="space-y-6">
              <div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="https://your-website.com/product-page"
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#296AFF] focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
              
              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !url.trim()}
                  className="flex-1 bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Analyzing...' : 'Analyze Product'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setIsManualMode(true);
                    onManualModeSet?.();
                  }}
                  className="flex-1 bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
                >
                  Manual Input Instead
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-white">
                Manual Product Details
              </h2>
              <div className="text-sm text-white/60">
                Step {currentStep} of {totalSteps}
              </div>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Product Category *
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="e.g., Electronics, Home & Garden, Sports"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#296AFF]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Product Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Describe your product in detail..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#296AFF]"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Keywords (comma-separated) *
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => {
                      setKeywords(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="e.g., wireless headphones, bluetooth, noise cancelling"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#296AFF]"
                  />
                  <p className="text-sm text-white/60 mt-2">
                    Provide at least 2 keywords separated by commas
                  </p>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#296AFF]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#296AFF]"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}

              <div className="flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed}
                    className="px-6 py-3 bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !canProceed}
                    className="px-8 py-3 bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Listing Pack'}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="mt-16">
          <UnifiedCTA />
        </div>
        
        <div className="mt-20">
          <ClientTestimonials />
        </div>
      </div>
    </section>
  );
}
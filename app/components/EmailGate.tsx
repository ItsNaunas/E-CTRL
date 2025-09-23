'use client';

import { useState } from 'react';
import UnifiedCTA from '@/components/UnifiedCTA';
import { isValidEmail } from '@/app/utils/validators';

interface EmailGateProps {
  onEmailSubmit: (email: string) => void;
  isLoading?: boolean;
  mode?: 'audit' | 'create';
}

export default function EmailGate({ onEmailSubmit, isLoading = false, mode = 'audit' }: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const validation = isValidEmail(email);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid email');
      setIsSubmitting(false);
      return;
    }

    // Track email submission
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'email_submit', {
        event_category: 'engagement',
        event_label: 'email_gate'
      });
    }

    try {
      // Call the API to submit the email
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: validation.parsedValue!,
          name: '', // You can add a name field if needed
          mode: mode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit email');
      }

      // Simulate processing delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onEmailSubmit(validation.parsedValue!);
    } catch (error) {
      console.error('Email submission error:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-[#0B0B0C]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with gradient text */}
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-[#296AFF]/20 to-[#FF7D2B]/20 mb-6 border border-white/10">
            <svg className="h-10 w-10 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] bg-clip-text text-transparent">
              Unlock Your Complete Amazon {mode === 'create' ? 'Listing Pack' : 'Audit Report'}
            </span>
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            You&apos;ve seen the preview! Enter your email to get the full detailed report with specific recommendations, action steps, and a downloadable PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2">
            <div className="bg-[#0B0B0C] rounded-xl border border-white/10 p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email-input" className="sr-only">
                    Email Address
                  </label>
                  <input
                    id="email-input"
                    data-testid="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your email address"
                    className={`block w-full rounded-lg border px-4 py-4 text-white placeholder-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-lg ${
                      error 
                        ? 'border-red-500/50 bg-red-900/20 focus:border-red-500 focus:ring-red-500' 
                        : 'border-white/20 bg-[#0B0B0C] focus:border-[#296AFF] focus:ring-[#296AFF]'
                    }`}
                    required
                    aria-describedby={error ? "email-error" : "email-help"}
                    aria-invalid={!!error}
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p id="email-error" className="mt-2 text-sm text-red-400" role="alert">
                      {error}
                    </p>
                  )}
                </div>

                <UnifiedCTA
                  type="submit"
                  variant="primary"
                  size="lg"
                  text="send me my report now"
                  fullWidth
                  disabled={isSubmitting}
                  data-testid="email-submit"
                />

                <div className="space-y-3">
                  <p id="email-help" className="text-sm text-white/90" data-testid="microcopy-free">
                    No credit card needed. Secure & private. Get instant access to your full report.
                  </p>
                  
                  <div className="flex items-center justify-center gap-6 text-xs text-white/70">
                    <div className="flex items-center gap-1">
                      <span className="text-[#296AFF]">✓</span>
                      <span>Free forever</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#296AFF]">✓</span>
                      <span>Secure & private</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#296AFF]">✓</span>
                      <span>No spam</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Benefits sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#296AFF]/10 to-[#FF7D2B]/10 rounded-xl border border-white/10 p-6 h-full">
              <h3 className="text-lg font-semibold text-white mb-4">What You&apos;ll Get:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#296AFF]/20 flex items-center justify-center mt-0.5">
                    <svg className="h-4 w-4 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      {mode === 'create' ? 'Complete Listing Pack' : 'Detailed Audit Report'}
                    </h4>
                    <p className="text-white/70 text-xs mt-1">
                      {mode === 'create' 
                        ? 'Optimized title, bullets, description & keywords' 
                        : 'In-depth analysis of your current listing issues'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF7D2B]/20 flex items-center justify-center mt-0.5">
                    <svg className="h-4 w-4 text-[#FF7D2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Instant Delivery</h4>
                    <p className="text-white/70 text-xs mt-1">PDF report delivered to your email within minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#296AFF]/20 flex items-center justify-center mt-0.5">
                    <svg className="h-4 w-4 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">100% Free</h4>
                    <p className="text-white/70 text-xs mt-1">No credit card required, completely free forever</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF7D2B]/20 flex items-center justify-center mt-0.5">
                    <svg className="h-4 w-4 text-[#FF7D2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Privacy Protected</h4>
                    <p className="text-white/70 text-xs mt-1">Your data is secure and never shared</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/70">
            <strong>What&apos;s included in your full report:</strong> Complete keyword analysis, listing optimization tips, conversion rate improvements, competitor insights, and a downloadable PDF with actionable steps.
          </p>
        </div>
      </div>
    </section>
  );
}

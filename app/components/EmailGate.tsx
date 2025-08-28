'use client';

import { useState } from 'react';
import CTAButton from '@/components/CTAButton';
import { isValidEmail } from '@/app/utils/validators';

interface EmailGateProps {
  onEmailSubmit: (email: string) => void;
  isLoading?: boolean;
}

export default function EmailGate({ onEmailSubmit, isLoading = false }: EmailGateProps) {
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

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onEmailSubmit(validation.parsedValue!);
    setIsSubmitting(false);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get Your Complete Amazon Audit Report
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            Enter your email to receive your detailed audit with specific recommendations and action steps.
          </p>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
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
                  className={`block w-full rounded-lg border px-4 py-3 text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-lg ${
                    error 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  required
                  aria-describedby={error ? "email-error" : "email-help"}
                  aria-invalid={!!error}
                  disabled={isSubmitting}
                />
                {error && (
                  <p id="email-error" className="mt-2 text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <CTAButton
                type="submit"
                variant="primary"
                size="lg"
                text="report"
                fullWidth
                disabled={isSubmitting}
                data-testid="email-submit"
              />

              <div className="space-y-3">
                <p id="email-help" className="text-sm text-gray-600" data-testid="microcopy-free">
                  No credit card needed. We never share your data.
                </p>
                
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    <span>Free forever</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    <span>Secure & private</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    <span>No spam</span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              💡 <strong>What&apos;s included:</strong> Keyword analysis, image optimization tips, conversion rate improvements, and competitor insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

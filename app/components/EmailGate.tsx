'use client';

import { useState } from 'react';
import CTAButton from '@/components/CTAButton';
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
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Unlock Your Complete Amazon Audit Report
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            You&apos;ve seen the preview! Enter your email to get the full detailed report with specific recommendations, action steps, and a downloadable PDF.
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
                text="send me my report now"
                fullWidth
                disabled={isSubmitting}
                data-testid="email-submit"
              />

              <div className="space-y-3">
                <p id="email-help" className="text-sm text-gray-600" data-testid="microcopy-free">
                  No credit card needed. Secure & private. Get instant access to your full report.
                </p>
                {/* TODO: Update with client-provided privacy/legal copy */}
                
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
              💡 <strong>What&apos;s included in your full report:</strong> Complete keyword analysis, image optimization tips, conversion rate improvements, competitor insights, and a downloadable PDF with actionable steps.
            </p>
            {/* TODO: Add client-provided legal disclaimer or terms */}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';

interface EmailCaptureProps {
  onEmailSubmit: (email: string) => void;
  isLoading?: boolean;
}

export default function EmailCapture({ onEmailSubmit, isLoading = false }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      onEmailSubmit(email.trim());
    }
  };

  if (isSubmitted) {
    return (
      <section className="bg-muted py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground mb-6">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Check your email!
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Your complete audit report is on its way to {email}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Didn&apos;t receive it? Check your spam folder or contact us.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Enter your email to see your complete audit
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We&apos;ll email you your detailed audit within 2 minutes
          </p>
          
          {/* Partial Results Preview Placeholder */}
          <div className="mt-8 p-6 bg-background rounded-lg border border-border">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Your Partial Results</h3>
              <p className="text-muted-foreground">Score: 72/100 • 3 quick wins identified</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="email-input" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="block w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  required
                  aria-describedby="email-help"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? 'Sending...' : 'Send Me My Free Report'}
              </button>
            </div>
            <p id="email-help" className="mt-3 text-sm text-muted-foreground text-center">
              No credit card required. Cancel anytime.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

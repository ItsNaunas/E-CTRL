'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [asinInput, setAsinInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle ASIN submission and show partial results
    console.log('ASIN submitted:', asinInput);
  };

  return (
    <section className="bg-background py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Free AI Audit of Your Amazon Listing — Boost Sales in Minutes
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Enter your ASIN or product link to get instant insights. No credit card required.
            </p>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="asin-input" className="sr-only">
                  Amazon ASIN or Product URL
                </label>
                <input
                  id="asin-input"
                  type="text"
                  value={asinInput}
                  onChange={(e) => setAsinInput(e.target.value)}
                  placeholder="Enter your Amazon ASIN or product URL"
                  className="block w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder-muted-foreground transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 sm:text-lg"
                  required
                  aria-describedby="asin-help"
                />
              </div>
              
              <button
                type="submit"
                className="w-full rounded-lg bg-accent px-6 py-3 text-lg font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 sm:text-xl"
              >
                Run My Free Audit
              </button>
              
              <p id="asin-help" className="text-sm text-muted-foreground text-center">
                Instant results. 100% free. Secure & private.
              </p>
            </form>
          </div>
          
          {/* Right Column - Preview Image */}
          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-accent/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Audit Preview</h3>
                <p className="text-muted-foreground">See your optimization insights here</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

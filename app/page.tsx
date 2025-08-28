'use client';

import { useState } from 'react';
import { useCROChecks } from './hooks/useCROChecks';
import Hero from '@/components/Hero';
import TrustBar from './components/TrustBar';
import UsageCounter from './components/UsageCounter';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Guarantees from './components/Guarantees';
import RepeatCTA from './components/RepeatCTA';
import PartialResult from './components/PartialResult';
import EmailGate from './components/EmailGate';
import StickyCTA from './components/StickyCTA';
import ReportDeliveryNote from './components/ReportDeliveryNote';

export default function HomePage() {
  // CRO audit hook (development only)
  useCROChecks();

  // Client-side state for the audit flow
  const [asinOrUrl, setAsinOrUrl] = useState('');
  const [showPartial, setShowPartial] = useState(false);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  // Mock partial result data
  const mockPartialResult = {
    score: 74,
    highlights: [
      "Bullet clarity needs improvement",
      "Image size meets requirements", 
      "Keyword gap: 'eco friendly' missing"
    ]
  };

  // Handle ASIN submission from Hero
  const handleAsinSubmit = (asin: string) => {
    setAsinOrUrl(asin);
    setShowPartial(true);
    // Scroll to partial result
    setTimeout(() => {
      document.getElementById('partial-result')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle unlock from PartialResult
  const handleUnlock = () => {
    setShowEmailGate(true);
    // Scroll to email gate
    setTimeout(() => {
      document.getElementById('email-gate')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle email submission
  const handleEmailSubmit = (email: string) => {
    setEmailSubmitted(true);
    setSubmittedEmail(email);
    // Scroll to delivery note
    setTimeout(() => {
      document.getElementById('delivery-note')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle CTA clicks (sticky and repeat CTAs)
  const handleCtaClick = () => {
    // Scroll to hero for new users, or to appropriate section for existing users
    if (!showPartial) {
      document.getElementById('hero-input')?.focus();
    } else if (!showEmailGate) {
      document.getElementById('email-gate')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('delivery-note')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Sticky CTA - Appears on scroll */}
      <StickyCTA onCtaClick={handleCtaClick} />

      {/* Hero Section - Primary Action */}
      <Hero onAsinSubmit={handleAsinSubmit} />

      {/* Trust Bar - Build Credibility */}
      <TrustBar />

      {/* Usage Counter - Social Proof */}
      <UsageCounter />

      {/* How It Works - Process Explanation */}
      <HowItWorks />

      {/* Benefits - Value Proposition */}
      <Benefits />

      {/* Testimonials - Social Proof */}
      <Testimonials />

      {/* Guarantees - Trust Building */}
      <Guarantees />

      {/* FAQ - Address Objections */}
      <FAQ />

      {/* Mid-page Repeat CTA */}
      <RepeatCTA variant="mid" onCtaClick={handleCtaClick} />

      {/* Conditional Flow Components */}
      {showPartial && (
        <div id="partial-result">
          <PartialResult
            score={mockPartialResult.score}
            highlights={mockPartialResult.highlights}
            onUnlock={handleUnlock}
          />
        </div>
      )}

      {showEmailGate && !emailSubmitted && (
        <div id="email-gate">
          <EmailGate
            onEmailSubmit={handleEmailSubmit}
            isLoading={false}
          />
        </div>
      )}

      {emailSubmitted && (
        <div id="delivery-note">
          <ReportDeliveryNote email={submittedEmail} />
        </div>
      )}

      {/* Footer Repeat CTA */}
      <RepeatCTA variant="footer" onCtaClick={handleCtaClick} />

      {/* Minimal Footer with Legal Links */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-bold">e-ctrl</span>
              <span className="ml-2 text-gray-400">Amazon Audit Tool</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/legal/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/legal/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 text-center text-xs text-gray-400">
            © 2024 e-ctrl. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

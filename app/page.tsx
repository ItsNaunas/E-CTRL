'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import TrustBar from './components/TrustBar';
import UsageCounter from './components/UsageCounter';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Recommendations from './components/Recommendations';
import RepeatCTA from './components/RepeatCTA';
import PartialResult from './components/PartialResult';
import EmailCapture from '@/components/EmailCapture';
import ReportDeliveryNote from './components/ReportDeliveryNote';

export default function HomePage() {
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

  return (
    <>
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

      {/* FAQ - Address Objections */}
      <FAQ />

      {/* Recommendations - Trust Building */}
      <Recommendations />

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
          <EmailCapture
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

      {/* Repeat CTA - Footer Variant */}
      <RepeatCTA />
    </>
  );
}

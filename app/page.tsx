'use client';

import { useState } from 'react';
import { useCROChecks } from './hooks/useCROChecks';
import Hero from '@/components/Hero';
import NewSellerHero from '@/components/NewSellerHero';
import ModeToggle from '@/components/ModeToggle';
import TrustBar from './components/TrustBar';
import UsageCounter from './components/UsageCounter';
import HowItWorks from './components/HowItWorks';
import NewSellerHowItWorks from './components/NewSellerHowItWorks';
import Benefits from './components/Benefits';
import NewSellerBenefits from './components/NewSellerBenefits';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import NewSellerFAQ from './components/NewSellerFAQ';
import Guarantees from './components/Guarantees';
import RepeatCTA from './components/RepeatCTA';
import PartialResult from './components/PartialResult';
import NewSellerPartialResult from './components/NewSellerPartialResult';
import EmailGate from './components/EmailGate';
import StickyCTA from './components/StickyCTA';
import ReportDeliveryNote from './components/ReportDeliveryNote';
import NewSellerDeliveryNote from './components/NewSellerDeliveryNote';
import AccessControl from './components/AccessControl';
import GuestResult from './components/GuestResult';

export default function HomePage() {
  // CRO audit hook (development only)
  useCROChecks();

  // Client-side state for the audit flow
  const [mode, setMode] = useState<'audit' | 'create'>('audit');
  const [asinOrUrl, setAsinOrUrl] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [showPartial, setShowPartial] = useState(false);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  
  // Access control state
  const [showAccessControl, setShowAccessControl] = useState(false);
  const [accessType, setAccessType] = useState<'guest' | 'account' | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [showGuestResult, setShowGuestResult] = useState(false);

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

  // Handle product URL submission from NewSellerHero
  const handleProductUrlSubmit = (url: string) => {
    setProductUrl(url);
    setShowPartial(true);
    // Scroll to partial result
    setTimeout(() => {
      document.getElementById('partial-result')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle unlock from PartialResult - now shows access control
  const handleUnlock = () => {
    setShowAccessControl(true);
    // Scroll to access control
    setTimeout(() => {
      document.getElementById('access-control')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle guest access (email only)
  const handleGuestAccess = (email: string) => {
    setAccessType('guest');
    setUserEmail(email);
    setShowGuestResult(true);
    // Scroll to guest result
    setTimeout(() => {
      document.getElementById('guest-result')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle account access (full registration)
  const handleAccountAccess = (email: string, password: string) => {
    setAccessType('account');
    setUserEmail(email);
    setShowEmailGate(true);
    // Scroll to email gate for full access
    setTimeout(() => {
      document.getElementById('email-gate')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle email submission (for account access)
  const handleEmailSubmit = (email: string) => {
    setEmailSubmitted(true);
    setSubmittedEmail(email);
    // Scroll to delivery note
    setTimeout(() => {
      document.getElementById('delivery-note')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle upgrade from guest to account
  const handleUpgrade = () => {
    setShowAccessControl(true);
    // Scroll to access control
    setTimeout(() => {
      document.getElementById('access-control')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle CTA clicks (sticky and repeat CTAs)
  const handleCtaClick = () => {
    // Scroll to hero for new users, or to appropriate section for existing users
    if (!showPartial) {
      if (mode === 'audit') {
        document.getElementById('hero-input')?.focus();
      } else {
        document.getElementById('new-seller-input')?.focus();
      }
    } else if (!showAccessControl) {
      document.getElementById('access-control')?.scrollIntoView({ behavior: 'smooth' });
    } else if (!showGuestResult && !showEmailGate) {
      document.getElementById('access-control')?.scrollIntoView({ behavior: 'smooth' });
    } else if (showGuestResult) {
      document.getElementById('guest-result')?.scrollIntoView({ behavior: 'smooth' });
    } else if (showEmailGate) {
      document.getElementById('email-gate')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('delivery-note')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Sticky CTA - Appears on scroll */}
      <StickyCTA onCtaClick={handleCtaClick} mode={mode} />

      {/* Mode Toggle */}
      <div className="pt-8">
        <ModeToggle mode={mode} onModeChange={setMode} />
      </div>

      {/* Hero Section - Primary Action */}
      {mode === 'audit' ? (
        <Hero onAsinSubmit={handleAsinSubmit} />
      ) : (
        <NewSellerHero onUrlSubmit={handleProductUrlSubmit} />
      )}

      {/* Trust Bar - Build Credibility */}
      <TrustBar />

      {/* Usage Counter - Social Proof */}
      <UsageCounter />

      {/* How It Works - Process Explanation */}
      {mode === 'audit' ? (
        <HowItWorks />
      ) : (
        <NewSellerHowItWorks />
      )}

      {/* Benefits - Value Proposition */}
      {mode === 'audit' ? (
        <Benefits />
      ) : (
        <NewSellerBenefits />
      )}

      {/* Testimonials - Social Proof */}
      <Testimonials />

      {/* Guarantees - Trust Building */}
      <Guarantees />

      {/* FAQ - Address Objections */}
      {mode === 'audit' ? (
        <FAQ />
      ) : (
        <NewSellerFAQ />
      )}

      {/* Mid-page Repeat CTA */}
      <RepeatCTA variant="mid" onCtaClick={handleCtaClick} mode={mode} />

      {/* Conditional Flow Components */}
      {showPartial && (
        <div id="partial-result">
          {mode === 'audit' ? (
            <PartialResult
              score={mockPartialResult.score}
              highlights={mockPartialResult.highlights}
              onUnlock={handleUnlock}
            />
          ) : (
            <NewSellerPartialResult
              productUrl={productUrl}
              onUnlock={handleUnlock}
            />
          )}
        </div>
      )}

      {/* Access Control System */}
      {showAccessControl && !showGuestResult && !showEmailGate && (
        <div id="access-control">
          <AccessControl
            mode={mode}
            onGuestAccess={handleGuestAccess}
            onAccountAccess={handleAccountAccess}
          />
        </div>
      )}

      {/* Guest Result (Limited Preview) */}
      {showGuestResult && (
        <div id="guest-result">
          <GuestResult
            mode={mode}
            email={userEmail}
            onUpgrade={handleUpgrade}
          />
        </div>
      )}

      {/* Email Gate (for Account Access) */}
      {showEmailGate && !emailSubmitted && (
        <div id="email-gate">
          <EmailGate
            onEmailSubmit={handleEmailSubmit}
            isLoading={false}
          />
        </div>
      )}

      {/* Full Result Delivery (Account Access) */}
      {emailSubmitted && (
        <div id="delivery-note">
          {mode === 'audit' ? (
            <ReportDeliveryNote email={submittedEmail} />
          ) : (
            <NewSellerDeliveryNote email={submittedEmail} />
          )}
        </div>
      )}

      {/* Footer Repeat CTA */}
      <RepeatCTA variant="footer" onCtaClick={handleCtaClick} mode={mode} />

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

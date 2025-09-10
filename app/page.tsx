'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCROChecks } from './hooks/useCROChecks';
import Hero from '@/components/Hero';
import NewSellerHero from '@/components/NewSellerHero';
import ModeToggle from '@/components/ModeToggle';
import StickyTabs from '@/components/StickyTabs';
import TrustSection from '@/components/TrustSection';
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

  // Real AI analysis result state
  const [aiResult, setAiResult] = useState<{
    score: number;
    highlights: string[];
    recommendations?: string[];
    detailedAnalysis?: any;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasUserInput, setHasUserInput] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [manualProductData, setManualProductData] = useState<{
    category: string;
    description: string;
    keywords: string[];
    fulfilmentIntent: string;
  } | null>(null);

  // Real data for AI analysis
  const sampleData = useMemo(() => ({
    asin: "", // Will be filled by user input
    keywords: ["eco friendly", "sustainable", "organic"],
    fulfilment: "FBA"
  }), []);

  // Don't load initial AI analysis - wait for user input
  // This prevents 400 errors from empty ASIN validation
  
  // Helper function for smooth scrolling to elements
  const scrollToElement = (elementId: string, offset: number = 0) => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };
  
  // Debug logging for state
  useEffect(() => {
    console.log('Homepage state:', {
      showPartial,
      hasUserInput,
      isAnalyzing,
      aiResult: aiResult ? 'has result' : 'no result'
    });
  }, [showPartial, hasUserInput, isAnalyzing, aiResult]);

  // Handle ASIN submission from Hero
  const handleAsinSubmit = async (asin: string) => {
    console.log('ASIN submitted:', asin);
    setAsinOrUrl(asin);
    setShowPartial(true);
    setIsAnalyzing(true);
    setHasUserInput(true);
    
    // Scroll to partial result immediately when analysis starts
    scrollToElement('partial-result', 80); // 80px offset for better positioning
    
    try {
      // Call preview API for analysis without creating database entry
      const requestBody = {
        type: 'existing_seller',
        data: {
          ...sampleData,
          asin: asin,
          email: 'preview@example.com', // Temporary email for preview only
          name: 'Preview User'
        }
      };
      console.log('Sending request to preview API:', requestBody);
      
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('ASIN submission preview result received:', result.aiResult);
        setAiResult({
          score: result.aiResult.score || 0,
          highlights: result.aiResult.highlights || [],
          recommendations: result.aiResult.recommendations || [],
          detailedAnalysis: result.aiResult.detailedAnalysis || {}
        });
        // No lead ID needed for preview
        setLeadId(null);
      } else {
        // Get error details from response
        const errorText = await response.text();
        console.error('Preview API request failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        // Fallback to error state if API fails
        setAiResult(null);
      }
    } catch (error) {
      console.error('Preview analysis failed:', error);
      // Fallback to error state
      setAiResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle product URL submission from NewSellerHero
  const handleProductUrlSubmit = async (url: string) => {
    setProductUrl(url);
    setHasUserInput(true);
    setIsAnalyzing(true);
    
    try {
      // Generate REAL preview WITHOUT creating database entry
      const requestBody = {
        type: 'new_seller',
        data: {
          name: 'Preview User',
          email: 'preview@example.com', // Temporary email for preview only
          keywords: ["eco friendly", "sustainable", "organic"],
          websiteUrl: url,
          category: "Home & Garden", // Required field
          desc: "Eco-friendly product for sustainable living", // Required field
          fulfilmentIntent: "FBA" as const, // Required field
          image: { // Required field - placeholder
            name: "placeholder.jpg",
            size: 1024,
            type: "image/jpeg"
          }
        }
      };

      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Real preview result:', result);
      
      if (result.success && result.aiResult) {
        // Convert new IDQ structure to old structure for compatibility
        const idqAnalysis = result.aiResult.idqAnalysis;
        const summary = result.aiResult.summary;
        
        setAiResult({
          score: 0, // No score in new format
          highlights: summary?.keyImprovements || [],
          recommendations: summary?.nextSteps || [],
          detailedAnalysis: {
            idqAnalysis: idqAnalysis,
            summary: summary
          }
        });
        
        setShowPartial(true); // Show preview first
        
        // Scroll to preview
        setTimeout(() => {
          scrollToElement('partial-result', 80);
        }, 100);
      } else {
        console.error('Failed to generate real preview:', result.error);
      }
    } catch (error) {
      console.error('Error generating real preview:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle manual product data submission from NewSellerHero
  const handleManualProductSubmit = async (data: {
    category: string;
    description: string;
    keywords: string[];
    fulfilmentIntent: string;
  }) => {
    // Store the manual data for later use
    setManualProductData(data);
    setHasUserInput(true);
    setIsAnalyzing(true);
    
    try {
      // Generate REAL preview WITHOUT creating database entry
      const requestBody = {
        type: 'new_seller',
        data: {
          name: 'Preview User',
          email: 'preview@example.com', // Temporary email for preview only
          keywords: data.keywords,
          websiteUrl: undefined, // No website URL for manual input
          category: data.category,
          desc: data.description,
          fulfilmentIntent: data.fulfilmentIntent as "FBA" | "FBM" | "Unsure",
          image: { // Required field - placeholder
            name: "placeholder.jpg",
            size: 1024,
            type: "image/jpeg"
          }
        }
      };

      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Real manual preview result:', result);
      
      if (result.success && result.aiResult) {
        // Convert new IDQ structure to old structure for compatibility
        const idqAnalysis = result.aiResult.idqAnalysis;
        const summary = result.aiResult.summary;
        
        setAiResult({
          score: 0, // No score in new format
          highlights: summary?.keyImprovements || [],
          recommendations: summary?.nextSteps || [],
          detailedAnalysis: {
            idqAnalysis: idqAnalysis,
            summary: summary
          }
        });
        
        setShowPartial(true); // Show preview first
        
        // Scroll to preview
        setTimeout(() => {
          scrollToElement('partial-result', 80);
        }, 100);
      } else {
        console.error('Failed to generate real manual preview:', result.error);
      }
    } catch (error) {
      console.error('Error generating real manual preview:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle unlock from PartialResult - now shows access control
  const handleUnlock = () => {
    setShowAccessControl(true);
    // Scroll to access control
    scrollToElement('access-control', 80);
  };

  // Handle guest access (email only)
  const handleGuestAccess = async (email: string) => {
    setAccessType('guest');
    setUserEmail(email);
    setShowGuestResult(true);
    setShowAccessControl(false); // Hide access control after guest access
    
    // For new sellers, we need to generate AI analysis first to create PDF data
    if (mode === 'create' && productUrl) {
      try {
        // Call AI API for new seller analysis to generate PDF data
        const requestBody = {
          type: 'new_seller',
          data: {
            name: email.split('@')[0],
            email: email,
            keywords: ["eco friendly", "sustainable", "organic"],
            websiteUrl: productUrl,
            category: "Home & Garden", // Required field
            desc: "Eco-friendly product for sustainable living", // Required field
            fulfilmentIntent: "FBA" as const, // Required field
            image: { // Required field - placeholder
              name: "placeholder.jpg",
              size: 1024,
              type: "image/jpeg"
            }
          }
        };
        
        console.log('Generating AI analysis for guest access:', requestBody);
        
        const response = await fetch('/api/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Guest AI analysis completed:', result);
        } else {
          console.error('Failed to generate AI analysis for guest');
        }
      } catch (error) {
        console.error('Error generating AI analysis for guest:', error);
      }
    }
    
    // Send welcome email for guest access too
    try {
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          name: email.split('@')[0], // Use email prefix as name
          mode: mode // Use current mode (audit or create)
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Guest welcome email sent:', result);
      } else {
        console.error('Failed to send guest welcome email');
      }
    } catch (error) {
      console.error('Error sending guest welcome email:', error);
    }
    
    // Scroll to guest result
    scrollToElement('guest-result', 80);
  };

  // Handle account access (full registration)
  const handleAccountAccess = async (email: string, password: string) => {
    setAccessType('account');
    setUserEmail(email);
    setSubmittedEmail(email); // Set the submitted email directly
    setEmailSubmitted(true); // Mark email as submitted
    setShowAccessControl(false); // Hide access control after account creation
    
    // For new sellers, we need to generate AI analysis first to create PDF data
    if (mode === 'create' && productUrl) {
      try {
        // Call AI API for new seller analysis to generate PDF data
        const requestBody = {
          type: 'new_seller',
          data: {
            name: email.split('@')[0],
            email: email,
            keywords: ["eco friendly", "sustainable", "organic"],
            websiteUrl: productUrl,
            category: "Home & Garden", // Required field
            desc: "Eco-friendly product for sustainable living", // Required field
            fulfilmentIntent: "FBA" as const, // Required field
            image: { // Required field - placeholder
              name: "placeholder.jpg",
              size: 1024,
              type: "image/jpeg"
            }
          }
        };
        
        console.log('Generating AI analysis for account creation:', requestBody);
        
        const response = await fetch('/api/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Account creation AI analysis completed:', result);
        } else {
          console.error('Failed to generate AI analysis for account creation');
        }
      } catch (error) {
        console.error('Error generating AI analysis for account creation:', error);
      }
    }
    
    // Send welcome email
    try {
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          name: email.split('@')[0], // Use email prefix as name
          mode: mode // Use current mode (audit or create)
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Welcome email sent:', result);
      } else {
        console.error('Failed to send welcome email');
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
    
    // Scroll to delivery note directly
    scrollToElement('delivery-note', 80);
  };

  // Handle email submission (for account access)
  const handleEmailSubmit = async (email: string) => {
    setEmailSubmitted(true);
    setSubmittedEmail(email);
    
    // Generate report with the user's actual email
    console.log('Generating report with user email:', email);
    setIsAnalyzing(true);
    
    try {
      console.log('Creating report and sending email for:', email);
      
      // Create the actual report with user's email based on mode
      let requestBody;
      
      if (mode === 'audit' && asinOrUrl) {
        // Existing seller flow - create actual report with user's email
        requestBody = {
          type: 'existing_seller',
          data: {
            ...sampleData,
            asin: asinOrUrl,
            email: email, // Use the actual user email
            name: email.split('@')[0] // Use email prefix as name
          }
        };
      } else if (mode === 'create' && (productUrl || manualProductData)) {
        // New seller flow - create actual report with user's email
        requestBody = {
          type: 'new_seller',
          data: {
            name: email.split('@')[0], // Use email prefix as name
            email: email, // Use the actual user email
            keywords: manualProductData?.keywords || ["eco friendly", "sustainable", "organic"],
            websiteUrl: productUrl || undefined,
            category: manualProductData?.category || "Home & Garden",
            desc: manualProductData?.description || "Eco-friendly product for sustainable living",
            fulfilmentIntent: (manualProductData?.fulfilmentIntent || "FBA") as "FBA" | "FBM" | "Unsure",
            image: { // Required field - placeholder
              name: "placeholder.jpg",
              size: 1024,
              type: "image/jpeg"
            }
          }
        };
      } else {
        console.error('Invalid mode or missing data for report generation');
        return;
      }
      
      console.log('Creating report with user email:', requestBody);
      
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Report created and email sent:', result);
        
        // Update the AI result with the real data
        if (result.aiResult) {
          // Convert new IDQ structure to old structure for compatibility
          const idqAnalysis = result.aiResult.idqAnalysis;
          const summary = result.aiResult.summary;
          
          setAiResult({
            score: 0, // No score in new format
            highlights: summary?.keyImprovements || [],
            recommendations: summary?.nextSteps || [],
            detailedAnalysis: {
              idqAnalysis: idqAnalysis,
              summary: summary
            }
          });
        }
        
        // Show delivery note (using existing emailSubmitted state)
        // The delivery note is already shown when emailSubmitted is true
      } else {
        console.error('Failed to create report and send email');
      }
    } catch (error) {
      console.error('Error creating report with user email:', error);
    } finally {
      setIsAnalyzing(false);
    }
    
    // Scroll to delivery note
    scrollToElement('delivery-note', 80);
  };

  // Handle upgrade from guest to account
  const handleUpgrade = () => {
    setShowGuestResult(false); // Hide guest result first
    setShowAccessControl(true); // Show access control
    // Scroll to access control after state update
    setTimeout(() => {
      const accessControlElement = document.getElementById('access-control');
      if (accessControlElement) {
        accessControlElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback: scroll to top of page if element not found
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 200);
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
       scrollToElement('access-control', 80);
     } else if (!showGuestResult && !showEmailGate) {
       scrollToElement('access-control', 80);
     } else if (showGuestResult) {
       scrollToElement('guest-result', 80);
     } else if (showEmailGate) {
       scrollToElement('email-gate', 80);
     } else {
       scrollToElement('delivery-note', 80);
     }
  };

  return (
    <>
      {/* Sticky Apple Glass Tabs */}
      <StickyTabs activeTab={mode} onTabChange={setMode} onCtaClick={handleCtaClick} />


      {/* Hero Section - Primary Action */}
      {mode === 'audit' ? (
        <Hero onAsinSubmit={handleAsinSubmit} />
      ) : (
        <NewSellerHero 
          onUrlSubmit={handleProductUrlSubmit} 
          onManualSubmit={handleManualProductSubmit}
        />
      )}

      {/* Trust Section - Build Credibility */}
      <TrustSection />

      {/* Section Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6 md:my-16" />

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

      {/* Section Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6 md:my-16" />

      {/* Testimonials - Social Proof */}
      <Testimonials />

      {/* Guarantees - Trust Building */}
      <Guarantees />

      {/* Section Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6 md:my-16" />

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
               score={hasUserInput ? (aiResult?.score || 0) : undefined}
               highlights={hasUserInput ? (aiResult?.highlights || [
                 "AI analysis in progress...",
                 "Enter an ASIN above to see real results",
                 "No results available yet"
               ]) : [
                 "Ready to analyze your Amazon listing",
                 "Enter an ASIN above to get started",
                 "Get instant AI-powered insights"
               ]}
               onUnlock={handleUnlock}
               isLoading={isAnalyzing}
             />
          ) : (
                         <NewSellerPartialResult
               productUrl={productUrl}
               manualData={manualProductData || undefined}
               onUnlock={handleUnlock}
               score={hasUserInput ? (aiResult?.score || 0) : undefined}
               highlights={hasUserInput ? (aiResult?.highlights || [
                 "AI analysis in progress...",
                 "Enter a product URL above to see real results",
                 "No results available yet"
               ]) : [
                 "Ready to analyze your product",
                 "Enter a product URL above to get started",
                 "Get instant AI-powered insights"
               ]}
               isLoading={isAnalyzing}
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
            mode={mode}
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
      <footer className="py-8 bg-[#0D0D0D] text-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-bold text-white">e-ctrl</span>
              <span className="ml-2 text-white/70">Amazon Audit Tool</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/legal/privacy" className="text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/legal/terms" className="text-white/70 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-center text-xs text-white/60">
            © 2024 e-ctrl. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

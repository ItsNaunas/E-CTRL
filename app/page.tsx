'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCROChecks } from './hooks/useCROChecks';
import Hero from '@/components/Hero';
import NewSellerHero from '@/components/NewSellerHero';
import ModeToggle from '@/components/ModeToggle';
import StickyTabs from '@/components/StickyTabs';
import TrustSection from '@/components/TrustSection';
import BeforeAfterProof from '@/components/BeforeAfterProof';
import HowItWorks from './components/HowItWorks';
import NewSellerHowItWorks from './components/NewSellerHowItWorks';
import HowItWorksSection from '@/components/HowItWorksSection';
import Benefits from './components/Benefits';
import NewSellerBenefits from './components/NewSellerBenefits';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import FAQAccordion from '@/components/FAQAccordion';
import RepeatCTA from './components/RepeatCTA';
import PartialResult from './components/PartialResult';
import NewSellerPartialResult from './components/NewSellerPartialResult';
import EmailGate from './components/EmailGate';
import ReportDeliveryNote from './components/ReportDeliveryNote';
import NewSellerDeliveryNote from './components/NewSellerDeliveryNote';
import AccessControl from './components/AccessControl';
import GuestResult from './components/GuestResult';
import AnalysisLoadingBar from '@/components/AnalysisLoadingBar';
import { ComponentErrorBoundary } from '@/components/ErrorBoundary';
import { reportApiError } from '@/lib/errorHandler';
import FooterGlow from '@/components/FooterGlow';
import { AUDIT_TYPES, FULFILMENT_TYPES, SAMPLE_DATA, FILE_CONSTANTS, EMAIL_CONSTANTS } from '@/lib/constants';

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
  const [forceManualMode, setForceManualMode] = useState(false);

  // Real data for AI analysis - no longer using SAMPLE_DATA
  const sampleData = useMemo(() => ({
    asin: "", // Will be filled by user input
    keywords: [], // Empty array instead of SAMPLE_DATA
    fulfilment: 'Unsure' // Default instead of SAMPLE_DATA
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

  // Simple CTA scroll function that scrolls to top
  const scrollToHeroForm = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
        type: AUDIT_TYPES.EXISTING_SELLER,
        data: {
          ...sampleData,
          asin: asin,
          email: EMAIL_CONSTANTS.PREVIEW_EMAIL, // Temporary email for preview only
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
        const errorData = await response.json();
        console.error('Preview API request failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        // Report API error
        reportApiError('/api/preview', response.status, errorData);
        
        // Show specific error message to user
        if (errorData.error) {
          setAiResult({
            score: 0,
            highlights: [],
            recommendations: [],
            detailedAnalysis: {
              error: errorData.error,
              errorCode: errorData.code
            }
          });
        } else {
          setAiResult(null);
        }
      }
    } catch (error) {
      console.error('Preview analysis failed:', error);
      // Report API error
      reportApiError('/api/preview', 0, error);
      // Fallback to error state
      setAiResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle product URL submission from NewSellerHero
  const handleProductUrlSubmit = async (url: string) => {
    console.log('Product URL submitted:', url);
    setProductUrl(url);
    setShowPartial(false); // Reset partial state - don't show analysis until we know URL is scannable
    // Don't set hasUserInput or isAnalyzing yet - only set them when we actually start analysis
    
    try {
      // First, check if URL is scannable (without doing full analysis)
      const checkResponse = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_seller',
          data: {
            name: 'Preview User',
            email: EMAIL_CONSTANTS.PREVIEW_EMAIL,
            keywords: ['product', 'quality'], // Dummy keywords to pass validation
            websiteUrl: url,
            category: 'General',
            desc: 'Checking if URL is scannable...',
            fulfilmentIntent: 'Unsure',
            image: {
              name: "placeholder.jpg",
              size: 1024,
              type: "image/jpeg"
            }
          },
          checkOnly: true // Just check if URL is scannable, don't do AI analysis
        })
      });
      
      const checkResult = await checkResponse.json();
      console.log('URL check result:', checkResponse.status, checkResult);
      
      if (checkResponse.ok && checkResult.success && checkResult.scannable) {
        // URL is scannable - now do the full analysis
        console.log('URL is scannable, proceeding with full analysis');
        setHasUserInput(true); // Only set this when we actually start analysis
        setIsAnalyzing(true); // Only start analyzing when we know URL is scannable
        
        // Make second API call for full analysis
        const analysisResponse = await fetch('/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'new_seller',
            data: {
              name: 'Preview User',
              email: EMAIL_CONSTANTS.PREVIEW_EMAIL,
              keywords: ['product', 'quality'], // Dummy keywords to pass validation
              websiteUrl: url,
              category: 'General',
              desc: 'Product analysis in progress...',
              fulfilmentIntent: 'Unsure',
              image: {
                name: "placeholder.jpg",
                size: 1024,
                type: "image/jpeg"
              }
            }
            // No checkOnly flag - do full analysis
          })
        });
        
        if (analysisResponse.ok) {
          const analysisResult = await analysisResponse.json();
          console.log('Analysis result:', analysisResult);
          
          if (analysisResult.success && analysisResult.aiResult) {
            const idqAnalysis = analysisResult.aiResult.idqAnalysis;
            const summary = analysisResult.aiResult.summary;
            
            // Create highlights from actual generated content
            const generatedHighlights = [];
            if (idqAnalysis?.title?.optimized) {
              generatedHighlights.push(idqAnalysis.title.optimized);
            }
            if (idqAnalysis?.bullets?.optimized) {
              generatedHighlights.push(...idqAnalysis.bullets.optimized);
            }
            if (idqAnalysis?.description?.optimized) {
              generatedHighlights.push(idqAnalysis.description.optimized);
            }
            if (summary?.keyImprovements) {
              generatedHighlights.push(...summary.keyImprovements);
            }
            
            setAiResult({
              score: 0,
              highlights: generatedHighlights,
              recommendations: summary?.nextSteps || [],
              detailedAnalysis: {
                idqAnalysis: idqAnalysis,
                summary: summary
              }
            });
            
            // Show partial results since analysis succeeded
            setShowPartial(true);
            scrollToElement('partial-result', 80);
          } else {
            // Analysis failed even though URL was scannable
            console.log('URL was scannable but analysis failed, switching to manual input');
            setForceManualMode(true);
            scrollToHeroForm();
          }
        } else {
          // Analysis API call failed
          console.log('Analysis API call failed, switching to manual input');
          setForceManualMode(true);
          scrollToHeroForm();
        }
      } else if (checkResponse.status === 400 && checkResult.code === 'URL_SCRAPING_FAILED') {
        // URL is specifically not scannable - show message and refer to manual input
        console.log('URL is not scannable (URL_SCRAPING_FAILED), showing message and referring to manual input');
        setShowPartial(false); // Make sure no analysis is shown
        setForceManualMode(true);
        scrollToHeroForm();
      } else {
        // Other errors (network issues, etc.) - show generic error
        console.error('URL check failed with unexpected error:', checkResponse.status, checkResult);
        setShowPartial(false); // Make sure no analysis is shown
        setForceManualMode(true);
        scrollToHeroForm();
      }
    } catch (error) {
      console.error('URL check error:', error);
      // Network or other errors - show message and refer to manual input
      console.log('URL check error, showing message and referring to manual input');
      setShowPartial(false); // Make sure no analysis is shown
      setForceManualMode(true);
      scrollToHeroForm();
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
    productName: string;
    brand: string;
    price: string;
    targetAudience: string;
    keyFeatures: string;
    benefits: string;
    dimensions: string;
    materials: string;
    useCase: string;
  }) => {
    console.log('Manual product data submitted:', data);
    // Store the manual data for later use
    setManualProductData(data);
    setHasUserInput(true);
    setIsAnalyzing(true);
    setShowPartial(true); // Show partial results immediately like existing seller
    
    // Scroll to partial result immediately when analysis starts
    scrollToElement('partial-result', 80);
    
    try {
      // Try URL first if available, then fallback to manual data
      const requestBody = {
        type: 'new_seller',
        data: {
          name: 'Preview User',
          email: EMAIL_CONSTANTS.PREVIEW_EMAIL, // Temporary email for preview only
          keywords: data.keywords,
          websiteUrl: productUrl || undefined, // Use URL if provided (fallback flow)
          category: data.category,
          desc: data.description,
          fulfilmentIntent: data.fulfilmentIntent as "FBA" | "FBM" | "Unsure",
          image: { // Required field - placeholder
            name: "placeholder.jpg",
            size: 1024,
            type: "image/jpeg"
          },
          // Enhanced fields for better AI generation
          productName: data.productName,
          brand: data.brand,
          price: data.price,
          targetAudience: data.targetAudience,
          keyFeatures: data.keyFeatures,
          benefits: data.benefits,
          dimensions: data.dimensions,
          materials: data.materials,
          useCase: data.useCase
        }
      };

      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('New seller manual preview result received:', result.aiResult);
        
        if (result.success && result.aiResult) {
          // Convert new IDQ structure to old structure for compatibility
          const idqAnalysis = result.aiResult.idqAnalysis;
          const summary = result.aiResult.summary;
          
          // Create highlights from actual generated content
          const generatedHighlights = [];
          if (idqAnalysis?.title?.optimized) {
            generatedHighlights.push(idqAnalysis.title.optimized);
          }
          if (idqAnalysis?.bullets?.optimized) {
            generatedHighlights.push(...idqAnalysis.bullets.optimized);
          }
          if (idqAnalysis?.description?.optimized) {
            generatedHighlights.push(idqAnalysis.description.optimized);
          }
          // Add any additional key improvements
          if (summary?.keyImprovements) {
            generatedHighlights.push(...summary.keyImprovements);
          }
          
          setAiResult({
            score: 0, // No score in new format
            highlights: generatedHighlights,
            recommendations: summary?.nextSteps || [],
            detailedAnalysis: {
              idqAnalysis: idqAnalysis,
              summary: summary
            }
          });
          // No lead ID needed for preview
          setLeadId(null);
        } else {
          console.error('No AI result received from successful response');
          setAiResult(null);
        }
      } else {
        // Get error details from response - same pattern as existing seller
        const errorData = await response.json();
        console.error('New seller manual preview API request failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        // Show specific error message to user - same pattern as existing seller
        if (errorData.error) {
          setAiResult({
            score: 0,
            highlights: [],
            recommendations: [],
            detailedAnalysis: {
              error: errorData.error,
              errorCode: errorData.code
            }
          });
        } else {
          setAiResult(null);
        }
      }
    } catch (error) {
      console.error('New seller manual preview analysis failed:', error);
      // Fallback to error state - same pattern as existing seller
      setAiResult(null);
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
    
    // Use the existing preview analysis data - no need to regenerate with placeholder data
    
    // Send welcome email for guest access too
    try {
      // Prepare preview data for PDF generation
      const previewData = {
        score: aiResult?.score || 0,
        highlights: aiResult?.highlights || [],
        recommendations: aiResult?.recommendations || [],
        detailedAnalysis: aiResult?.detailedAnalysis || {},
        // Extract idqAnalysis and summary for PDF generation
        idqAnalysis: aiResult?.detailedAnalysis?.idqAnalysis || {},
        summary: aiResult?.detailedAnalysis?.summary || {},
        asin: mode === 'audit' ? asinOrUrl : undefined,
        productUrl: mode === 'create' ? productUrl : undefined,
        keywords: mode === 'audit' ? (manualProductData?.keywords || sampleData.keywords) : (manualProductData?.keywords || []),
        fulfilment: mode === 'audit' ? sampleData.fulfilment : (manualProductData?.fulfilmentIntent || 'Unsure'),
        category: mode === 'create' ? (manualProductData?.category || '') : undefined,
        productDesc: mode === 'create' ? (manualProductData?.description || '') : undefined
      };
      
      // Debug logging
      console.log('=== GUEST ACCESS DEBUG ===');
      console.log('aiResult:', aiResult);
      console.log('previewData.idqAnalysis:', previewData.idqAnalysis);
      console.log('previewData.summary:', previewData.summary);
      console.log('previewData.highlights:', previewData.highlights);
      console.log('========================');
      
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          name: email.split('@')[0], // Use email prefix as name
          mode: mode, // Use current mode (audit or create)
          previewData: previewData
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
    
    // Use the existing preview analysis data - no need to regenerate with placeholder data
    
    // Send welcome email
    try {
      // Prepare preview data for PDF generation
      const previewData = {
        score: aiResult?.score || 0,
        highlights: aiResult?.highlights || [],
        recommendations: aiResult?.recommendations || [],
        detailedAnalysis: aiResult?.detailedAnalysis || {},
        // Extract idqAnalysis and summary for PDF generation
        idqAnalysis: aiResult?.detailedAnalysis?.idqAnalysis || {},
        summary: aiResult?.detailedAnalysis?.summary || {},
        asin: mode === 'audit' ? asinOrUrl : undefined,
        productUrl: mode === 'create' ? productUrl : undefined,
        keywords: mode === 'audit' ? (manualProductData?.keywords || sampleData.keywords) : (manualProductData?.keywords || []),
        fulfilment: mode === 'audit' ? sampleData.fulfilment : (manualProductData?.fulfilmentIntent || 'Unsure'),
        category: mode === 'create' ? (manualProductData?.category || '') : undefined,
        productDesc: mode === 'create' ? (manualProductData?.description || '') : undefined
      };
      
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          name: email.split('@')[0], // Use email prefix as name
          mode: mode, // Use current mode (audit or create)
          previewData: previewData
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
    
    // Send email with preview data to maintain consistency
    console.log('Sending email with preview data for:', email);
    setIsAnalyzing(true);
    
    try {
      console.log('Submitting email with preview data for:', email);
      
      // Prepare preview data to send with email
      const previewData = {
        score: aiResult?.score || 0,
        highlights: aiResult?.highlights || [],
        recommendations: aiResult?.recommendations || [],
        detailedAnalysis: aiResult?.detailedAnalysis || {},
        // Extract idqAnalysis and summary for PDF generation
        idqAnalysis: aiResult?.detailedAnalysis?.idqAnalysis || {},
        summary: aiResult?.detailedAnalysis?.summary || {},
        asin: mode === 'audit' ? asinOrUrl : undefined,
        productUrl: mode === 'create' ? productUrl : undefined,
        keywords: mode === 'audit' ? (manualProductData?.keywords || sampleData.keywords) : (manualProductData?.keywords || []),
        fulfilment: mode === 'audit' ? sampleData.fulfilment : (manualProductData?.fulfilmentIntent || 'Unsure'),
        category: mode === 'create' ? (manualProductData?.category || '') : undefined,
        productDesc: mode === 'create' ? (manualProductData?.description || '') : undefined
      };
      
      console.log('Preview data being sent:', previewData);
      
      // Use submit-email API to send email with preview data
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          name: email.split('@')[0], // Use email prefix as name
          mode: mode,
          previewData: previewData
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Email sent successfully:', result);
        
        // Scroll to delivery note
        scrollToElement('delivery-note', 80);
      } else {
        const errorData = await response.json();
        console.error('Email submission failed:', errorData);
        setAiResult(null);
      }
    } catch (error) {
      console.error('Email submission failed:', error);
      setAiResult(null);
    } finally {
      setIsAnalyzing(false);
    }
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
    // Always scroll to hero form first, then focus the appropriate input
    scrollToHeroForm();
    
    // Focus the appropriate input field after scrolling
    setTimeout(() => {
      if (mode === 'audit') {
        document.getElementById('hero-input')?.focus();
      } else {
        document.getElementById('new-seller-input')?.focus();
      }
    }, 300); // Wait for scroll to complete
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
          isAnalyzing={isAnalyzing}
          forceManualMode={forceManualMode}
          onManualModeSet={() => setForceManualMode(false)}
        />
      )}

      {/* Before/After Proof - Visual Transformation */}
      {/* <BeforeAfterProof onCtaClick={scrollToHeroForm} /> */}

      {/* Section Divider */}
      {/* <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6 md:my-16" /> */}

      {/* How It Works - Process Explanation */}
      <HowItWorksSection onCtaClick={scrollToHeroForm} />

      {/* Trust Section - Build Credibility (moved below How It Works) */}
      <TrustSection />

      {/* Section Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6 md:my-16" />

      {/* Benefits - Value Proposition */}
      {mode === 'audit' ? (
        <Benefits />
      ) : (
        <NewSellerBenefits />
      )}

      {/* Section Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6 md:my-16" />

      {/* Testimonials - Social Proof - HIDDEN FOR LATER USE */}
      {/* <TestimonialsCarousel /> */}

      {/* Section Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6 md:my-16" />

      {/* FAQ - Address Objections */}
      <FAQAccordion />


      {/* Conditional Flow Components */}
      {showPartial && (
        <ComponentErrorBoundary context="Analysis Results">
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
               detailedAnalysis={aiResult?.detailedAnalysis}
             />
          ) : (
                         <NewSellerPartialResult
               productUrl={productUrl}
               manualData={manualProductData || undefined}
               onUnlock={handleUnlock}
               score={hasUserInput ? (aiResult?.score || 0) : undefined}
               highlights={hasUserInput && aiResult?.highlights?.length ? aiResult.highlights : [
                 hasUserInput ? "AI analysis in progress..." : "Ready to analyze your product",
                 hasUserInput ? "Enter a product URL above to see real results" : "Enter a product URL above to get started",
                 hasUserInput ? "No results available yet" : "Get instant AI-powered insights"
               ]}
               isLoading={isAnalyzing}
             />
          )}
        </div>
        </ComponentErrorBoundary>
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


      {/* Premium Footer with Glass Effect */}
      <FooterGlow onCtaClick={scrollToHeroForm} />

      {/* Analysis Loading Bar */}
      <ComponentErrorBoundary context="Analysis Loading">
        <AnalysisLoadingBar
          isVisible={isAnalyzing}
          mode={mode}
          onComplete={() => {
            // Analysis complete - let the existing flow handle the results
            console.log('Analysis completed via loading bar');
          }}
          onCancel={() => {
            setIsAnalyzing(false);
            setShowPartial(false);
          }}
        />
      </ComponentErrorBoundary>
    </>
  );
}

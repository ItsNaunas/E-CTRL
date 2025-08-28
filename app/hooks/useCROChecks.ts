'use client';

import { useEffect } from 'react';

export function useCROChecks() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const warnings: string[] = [];

    // Check for critical CRO elements
    const checks = [
      {
        selector: '[data-testid="hero-input"]',
        message: 'Hero input field missing data-testid="hero-input"'
      },
      {
        selector: '[data-testid="hero-cta"]',
        message: 'Hero CTA button missing data-testid="hero-cta"'
      },
      {
        selector: '[data-testid="sticky-cta"]',
        message: 'Sticky CTA missing data-testid="sticky-cta"'
      },
      {
        selector: '[data-testid="repeat-cta-mid"]',
        message: 'Mid-page repeat CTA missing data-testid="repeat-cta-mid"'
      },
      {
        selector: '[data-testid="repeat-cta-footer"]',
        message: 'Footer repeat CTA missing data-testid="repeat-cta-footer"'
      },
      {
        selector: '[data-testid="email-input"]',
        message: 'Email input missing data-testid="email-input"'
      },
      {
        selector: '[data-testid="email-submit"]',
        message: 'Email submit button missing data-testid="email-submit"'
      },
      {
        selector: '[data-testid="trustbar"]',
        message: 'Trust bar missing data-testid="trustbar"'
      },
      {
        selector: '[data-testid="microcopy-free"]',
        message: 'Free microcopy missing data-testid="microcopy-free"'
      },
      {
        selector: '[data-testid="faq-accordion-q"]',
        message: 'FAQ accordion questions missing data-testid="faq-accordion-q"'
      }
    ];

    checks.forEach(check => {
      const element = document.querySelector(check.selector);
      if (!element) {
        warnings.push(check.message);
      }
    });

    // Check for navigation distractions
    const navElements = document.querySelectorAll('nav, header a[href]:not([href="#"]), .navigation, .menu');
    if (navElements.length > 0) {
      warnings.push('Navigation elements detected - consider removing for single-purpose landing page');
    }

    // Check for multiple primary CTAs
    const primaryCTAs = document.querySelectorAll('[data-testid*="cta"]');
    if (primaryCTAs.length < 3) {
      warnings.push('Insufficient CTA repetition - should have hero + sticky + repeat CTAs');
    }

    // Check for trust signals
    const trustElements = document.querySelectorAll('[data-testid="trustbar"], [data-testid="usage-counter"], [data-testid="testimonials"]');
    if (trustElements.length < 2) {
      warnings.push('Insufficient trust signals - should have trust bar + usage counter + testimonials');
    }

    // Log warnings
    if (warnings.length > 0) {
      console.group('🚨 CRO Audit Warnings');
      warnings.forEach(warning => {
        console.warn(warning);
      });
      console.groupEnd();
    } else {
      console.log('✅ CRO audit passed - all critical elements present');
    }
  }, []);
}

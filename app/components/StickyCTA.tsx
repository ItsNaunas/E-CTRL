'use client';

import { useState, useEffect } from 'react';
import CTAButton from '@/components/CTAButton';

interface StickyCTAProps {
  onCtaClick: () => void;
  mode?: 'audit' | 'create';
}

export default function StickyCTA({ onCtaClick, mode = 'audit' }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + 100; // Show 100px after hero
        setIsVisible(scrollPosition > heroBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    // Track sticky CTA click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'sticky_cta_click', {
        event_category: 'engagement',
        event_label: 'sticky_header'
      });
    }
    onCtaClick();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-900">e-ctrl</span>
            <span className="ml-2 text-sm text-gray-500">
              {mode === 'audit' ? 'Amazon Audit Tool' : 'Amazon Listing Creator'}
            </span>
          </div>
          
                     <CTAButton
             variant="primary"
             size="sm"
             text={mode === 'audit' ? 'audit my listing' : 'create listing now'}
             onClick={handleClick}
             className="ml-4"
             data-testid="sticky-cta"
           />
        </div>
      </div>
    </div>
  );
}

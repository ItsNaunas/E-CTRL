 'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UnifiedCTA from './UnifiedCTA';

interface StickyTabsProps {
  activeTab: 'audit' | 'create';
  onTabChange: (tab: 'audit' | 'create') => void;
  onCtaClick: () => void;
}

export default function StickyTabs({ activeTab, onTabChange, onCtaClick }: StickyTabsProps) {

  const handleTabChange = (tab: 'audit' | 'create') => {
    // Scroll to top when switching tabs
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Change tab after scroll starts
    onTabChange(tab);
  };

  const handleCtaClick = () => {
    // Track sticky CTA click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'sticky_cta_click', {
        event_category: 'engagement',
        event_label: 'sticky_header'
      });
    }
    onCtaClick();
  };

  return (
    <>
      {/* Tablet Top Tabs - Only visible on tablet, tabs only */}
      <div className="fixed top-6 left-0 right-0 z-40 md:block lg:hidden hidden">
        <div className="flex items-center justify-center px-6">
          {/* Tab Toggle - Centered */}
          <div className="flex bg-white/[0.08] ring-1 ring-white/25 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-full p-1">
            <button
              type="button"
              onClick={() => handleTabChange('audit')}
              className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'audit'
                  ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/8 hover:border-white/10 border border-transparent'
              }`}
              aria-label="Audit existing Amazon listing"
            >
              Audit Existing Amazon Listing
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('create')}
              className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'create'
                  ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/8 hover:border-white/10 border border-transparent'
              }`}
              aria-label="Create new Amazon listing"
            >
              Create New Amazon Listing
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Top Tabs - Only visible on desktop */}
      <div className="fixed top-8 left-0 right-0 z-40 lg:block hidden">
        <div className="flex items-center px-4 lg:px-8 relative">
          {/* Logo - Responsive positioning */}
          <Link href="/" className="flex items-center absolute left-[15%] lg:left-1/4 transform -translate-x-1/2">
            <Image
              src="/logos/logo.png"
              alt="e-ctrl"
              width={1020}
              height={306}
              className="h-28 lg:h-36 w-auto"
              priority
            />
          </Link>
          
          {/* Tab Toggle - Absolutely centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="flex bg-white/[0.08] ring-1 ring-white/25 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-full p-1">
            <button
              type="button"
              onClick={() => handleTabChange('audit')}
              className={`px-4 lg:px-6 py-3 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 ${
                activeTab === 'audit'
                  ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/8 hover:border-white/10 border border-transparent'
              }`}
              aria-label="Audit existing Amazon listing"
            >
              Audit Existing Amazon Listing
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('create')}
              className={`px-4 lg:px-6 py-3 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 ${
                activeTab === 'create'
                  ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/8 hover:border-white/10 border border-transparent'
              }`}
              aria-label="Create new Amazon listing"
            >
              Create New Amazon Listing
            </button>
          </div>
          </div>
          
          {/* CTA Button - Responsive positioning */}
          <div className="flex items-center absolute right-[15%] lg:right-1/4 transform translate-x-1/2">
            <UnifiedCTA
              variant="primary"
              size="sm"
              text={activeTab === 'audit' ? 'run free audit' : 'create listing now'}
              onClick={handleCtaClick}
              data-testid="sticky-cta"
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tabs - Only visible on mobile */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
        <div className="flex bg-white/[0.08] ring-1 ring-white/25 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-full p-1">
          <button
            type="button"
            onClick={() => handleTabChange('audit')}
            className={`flex-1 px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'audit'
                ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20'
                : 'text-white/70 hover:text-white hover:bg-white/8 hover:border-white/10 border border-transparent'
            }`}
            aria-label="Audit existing Amazon listing"
          >
            Audit Existing Amazon Listing
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('create')}
            className={`flex-1 px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'create'
                ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20'
                : 'text-white/70 hover:text-white hover:bg-white/8 hover:border-white/10 border border-transparent'
            }`}
            aria-label="Create new Amazon listing"
          >
            Create New Amazon Listing
          </button>
        </div>
      </div>
    </>
  );
}

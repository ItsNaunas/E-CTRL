 'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
      {/* Desktop Top Tabs - Only visible on desktop */}
      <div className="fixed top-4 left-0 right-0 z-40 md:block hidden">
        <div className="flex items-center justify-between px-4">
          {/* Logo - Top Left */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logos/logo.png"
              alt="e-ctrl"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
          
          {/* Tab Toggle - Centered */}
          <div className="flex justify-center">
          <div className="flex bg-white/[0.08] ring-1 ring-white/25 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-full p-1">
            <button
              type="button"
              onClick={() => handleTabChange('audit')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
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
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
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
          
          {/* CTA Button - Top Right */}
          <div className="flex items-center">
          <button
            type="button"
            onClick={handleCtaClick}
            className="relative inline-flex h-[48px] rounded-[24px] p-[1.5px] bg-[linear-gradient(90deg,#296AFF_0%,#FF7D2B_100%)] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_8px_32px_rgba(41,106,255,0.3)] hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-[0_0_0_0_rgba(0,0,0,0)]"
            data-testid="sticky-cta"
          >
            {/* Inner fill (pure black) */}
            <span className="relative flex-1 rounded-[22.5px] bg-black text-white font-medium text-base leading-none inline-flex items-center justify-center select-none px-6">
              {activeTab === 'audit' ? 'run free audit' : 'create listing now'}
              {/* Optional glossy overlay from your Figma fill @ ~38% */}
              <span className="pointer-events-none absolute inset-0 rounded-[22.5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_60%)] opacity-40" />
            </span>
          </button>
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

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Centralized CTA configuration - change here, changes everywhere
export const CTA_CONFIG = {
  // Visual styling - mobile-optimized with proper fill-to-stroke ratios
  primary: {
    background: 'bg-gradient-to-r from-[#296AFF] to-[#FF7D2B]',
    shadow: 'shadow-lg shadow-[#296AFF]/30',
    hoverShadow: 'hover:shadow-[0_0_40px_rgba(41,106,255,0.6),0_0_60px_rgba(255,125,43,0.4)]',
    hoverScale: 'hover:scale-105',
    activeScale: 'active:scale-95',
    textColor: 'text-white',
    border: '',
    // Fill effect relative to button dimensions, not text
    fillEffect: 'before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:via-transparent before:to-transparent before:opacity-50 before:rounded-xl',
  },
  secondary: {
    background: 'bg-transparent',
    shadow: '',
    hoverShadow: 'hover:shadow-lg hover:shadow-white/20',
    hoverScale: 'hover:scale-102',
    activeScale: 'active:scale-98',
    textColor: 'text-white/90',
    border: 'border-2 border-white/30 hover:border-white/60 hover:bg-white/10',
    fillEffect: 'before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:via-transparent before:to-transparent before:opacity-30 before:rounded-xl',
  },
  
  // Sizes - mobile-first approach with consistent button dimensions
  sizes: {
    sm: {
      // Fixed button dimensions that don't change with text size
      height: 'h-12',
      minHeight: 'min-h-12',
      padding: 'px-6',
      text: 'text-sm',
      // Mobile-specific overrides to ensure consistency
      mobile: 'h-12 min-h-12 px-6 text-sm',
      // Button stroke/border dimensions
      strokeWidth: '2px',
    },
    md: {
      height: 'h-14',
      minHeight: 'min-h-14',
      padding: 'px-8',
      text: 'text-base',
      mobile: 'h-14 min-h-14 px-8 text-base',
      strokeWidth: '2px',
    },
    lg: {
      height: 'h-16',
      minHeight: 'min-h-16',
      padding: 'px-10',
      text: 'text-lg',
      mobile: 'h-16 min-h-16 px-10 text-lg',
      strokeWidth: '2px',
    },
  },
  
  // Base styles that apply to all CTAs
  base: {
    classes: 'relative inline-flex items-center justify-center font-bold text-center rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation overflow-hidden',
    disabled: 'disabled:hover:scale-100 disabled:hover:shadow-lg',
    // Ensure button maintains its shape regardless of text content
    shape: 'flex-shrink-0',
  },
  
  // Text content
  texts: {
    audit: 'Run My Free Audit',
    report: 'Get My Free Report',
    unlock: 'Unlock My Amazon Audit',
    create: 'Create My Listing',
    download: 'Download Full Report',
    'audit my listing': 'Audit My Listing',
    'create listing now': 'Create Listing Now',
  }
};

interface UnifiedCTAProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  text?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  showArrow?: boolean;
  loading?: boolean;
  // Mobile-specific props
  mobileOptimized?: boolean;
}

export default function UnifiedCTA({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  text = 'audit',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  showArrow = true,
  loading = false,
  mobileOptimized = true
}: UnifiedCTAProps) {
  
  // Get configuration for current variant and size
  const variantConfig = CTA_CONFIG[variant];
  const sizeConfig = CTA_CONFIG.sizes[size];
  
  // Build classes dynamically from config
  const buttonClasses = [
    CTA_CONFIG.base.classes,
    CTA_CONFIG.base.shape,
    variantConfig.background,
    variantConfig.shadow,
    variantConfig.hoverShadow,
    variantConfig.hoverScale,
    variantConfig.activeScale,
    variantConfig.textColor,
    variantConfig.border,
    variantConfig.fillEffect,
    // Use mobile-optimized sizing
    mobileOptimized ? sizeConfig.mobile : `${sizeConfig.height} ${sizeConfig.padding} ${sizeConfig.text}`,
    fullWidth ? 'w-full' : '',
    CTA_CONFIG.base.disabled,
    className
  ].filter(Boolean).join(' ');

  // Get text content
  const buttonText = text || CTA_CONFIG.texts.audit;

  const ButtonContent = (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      className={buttonClasses}
      // Ensure button maintains consistent dimensions
      style={{
        minHeight: sizeConfig.minHeight.replace('min-h-', '') + 'px',
        height: sizeConfig.height.replace('h-', '') + 'px',
      }}
    >
      {/* Content - positioned relative to button, not text */}
      <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        <span className="flex-1 text-center">{buttonText}</span>
        
        {/* Arrow icon */}
        {showArrow && !loading && (
          <svg 
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        )}
      </span>
    </button>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {ButtonContent}
      </Link>
    );
  }

  return ButtonContent;
}

// CTA_CONFIG is already exported above
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewCTAButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  text?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const ctaTexts = {
  audit: 'Run My Free Audit',
  report: 'Get My Free Report',
  unlock: 'Unlock My Amazon Audit'
};

export default function NewCTAButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  text = 'audit',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false
}: NewCTAButtonProps) {
  
  const sizeClasses = {
    sm: 'h-12 px-6 text-sm',
    md: 'h-14 px-8 text-base',
    lg: 'h-16 px-10 text-lg'
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonContent = text || ctaTexts.audit;

  const ButtonContent = (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${widthClasses}
        ${className}
        
        /* Base styles */
        relative inline-flex items-center justify-center
        font-bold text-white text-center
        rounded-xl
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-4 focus:ring-white/30
        disabled:opacity-50 disabled:cursor-not-allowed
        touch-manipulation
        
        /* Primary variant - Bright gradient with glow */
        ${variant === 'primary' ? `
          bg-gradient-to-r from-[#296AFF] to-[#FF7D2B]
          shadow-lg shadow-[#296AFF]/30
          hover:shadow-[0_0_40px_rgba(41,106,255,0.6),0_0_60px_rgba(255,125,43,0.4)]
          hover:scale-105
          active:scale-95
          disabled:hover:scale-100 disabled:hover:shadow-lg
        ` : ''}
        
        /* Secondary variant - Subtle outline */
        ${variant === 'secondary' ? `
          bg-transparent
          border-2 border-white/30
          text-white/90
          hover:border-white/60
          hover:bg-white/10
          hover:shadow-lg hover:shadow-white/20
        ` : ''}
      `}
    >
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {buttonContent}
        
        {/* Arrow icon */}
        <svg 
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
      
      {/* Subtle inner highlight for depth */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-50" />
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

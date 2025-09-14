'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CTAButtonProps {
  variant?: 'primary' | 'secondary' | 'sticky';
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

const stickyText = 'Get Free Audit';

export default function CTAButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  text = 'audit',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false
}: CTAButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation';
  
  const sizeClasses = {
    sm: 'h-12 px-5 text-sm py-3',
    md: 'h-14 px-7 text-base py-4 md:py-5 md:px-10',
    lg: 'h-16 px-9 text-lg py-4 md:py-5 md:px-12'
  };

  const variantClasses = {
    primary: 'relative overflow-hidden focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0B0B0C] hover:shadow-[0_0_40px_rgba(41,106,255,0.6)] hover:shadow-[0_0_60px_rgba(255,125,43,0.4)] hover:-translate-y-1 active:translate-y-0 disabled:hover:translate-y-0 disabled:hover:shadow-none bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] text-white transition-all duration-300 ease-out group shadow-lg shadow-[#296AFF]/30',
    secondary: 'border-2 border-white/20 text-white/90 hover:border-[#FF7D2B] hover:bg-[#FF7D2B]/10 transition-all duration-300 focus:ring-2 focus:ring-[#FF7D2B]/50 focus:ring-offset-2 focus:ring-offset-[#0B0B0C] bg-[#0B0B0C] backdrop-blur-sm hover:shadow-lg hover:shadow-[#FF7D2B]/20',
    sticky: 'relative overflow-hidden focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0B0B0C] hover:shadow-[0_0_40px_rgba(41,106,255,0.6)] hover:shadow-[0_0_60px_rgba(255,125,43,0.4)] hover:-translate-y-1 active:translate-y-0 disabled:hover:translate-y-0 disabled:hover:shadow-none bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] text-white transition-all duration-300 ease-out group shadow-lg shadow-[#296AFF]/30'
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${className}`;

  const buttonContent = text || (variant === 'sticky' ? stickyText : ctaTexts.audit);

  const ButtonContent = (
    <button
      onClick={onClick}
      className={buttonClasses}
      type={type}
      disabled={disabled}
    >
      {/* Content */}
      <span className="relative z-10 flex-1 text-white font-bold leading-tight inline-flex items-center justify-center select-none h-full tracking-wide">
        {buttonContent}
        
        {/* Arrow icon */}
        <svg 
          className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
      
      {/* Subtle inner highlight for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-50" />
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

// Sticky CTA Header Component
export function StickyCTA() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isSticky) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/5 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-lg font-bold text-white">e-ctrl</span>
          </div>
          <CTAButton
            variant="sticky"
            size="sm"
            text="Get Free Audit"
            href="/tool"
            className="ml-4"
          />
        </div>
      </div>
    </div>
  );
}

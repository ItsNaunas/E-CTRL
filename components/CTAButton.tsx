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
    sm: 'h-11 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg'
  };

  const variantClasses = {
    primary: 'relative rounded-full p-[1.5px] bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] focus:ring-white/20 hover:shadow-lg hover:shadow-[#296AFF]/25 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:hover:shadow-none',
    secondary: 'border border-white/20 text-white/90 hover:border-white/40 hover:bg-white/5 transition focus:ring-white/20 rounded-xl',
    sticky: 'relative rounded-full p-[1.5px] bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] focus:ring-white/20 hover:shadow-lg hover:shadow-[#296AFF]/25 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:hover:shadow-none'
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
      {(variant === 'primary' || variant === 'sticky') ? (
        <>
          {/* Inner fill with consistent sizing */}
          <span className="relative flex-1 rounded-full bg-black text-white font-semibold leading-tight inline-flex items-center justify-center select-none h-full">
            {buttonContent}
            {/* Subtle glossy overlay */}
            <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/20 via-white/5 to-transparent opacity-30" />
          </span>
        </>
      ) : (
        buttonContent
      )}
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
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/5 border-b border-white/10 shadow-lg transition-all duration-300">
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

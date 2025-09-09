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
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#007AFF] to-[#FF6B00] text-white font-medium shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99] focus:ring-[#007AFF]/30',
    secondary: 'border border-white/15 text-white/90 hover:border-white/40 hover:bg-white/5 transition focus:ring-white/20',
    sticky: 'bg-gradient-to-r from-[#007AFF] to-[#FF6B00] text-white font-medium shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99] focus:ring-[#007AFF]/30'
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
      {buttonContent}
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

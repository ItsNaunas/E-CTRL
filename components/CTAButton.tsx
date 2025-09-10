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
    primary: 'relative inline-flex h-[60px] rounded-[45px] p-[1.5px] bg-[linear-gradient(90deg,#296AFF_0%,#FF7D2B_100%)] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_8px_32px_rgba(41,106,255,0.3)] hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-[0_0_0_0_rgba(0,0,0,0)]',
    secondary: 'border border-white/15 text-white/90 hover:border-white/40 hover:bg-white/5 transition focus:ring-white/20',
    sticky: 'relative inline-flex h-[48px] rounded-[24px] p-[1.5px] bg-[linear-gradient(90deg,#296AFF_0%,#FF7D2B_100%)] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_8px_32px_rgba(41,106,255,0.3)] hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-[0_0_0_0_rgba(0,0,0,0)]'
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
          {/* Inner fill (pure black) */}
          <span className="relative flex-1 rounded-[43.5px] bg-black text-white font-medium text-base leading-none inline-flex items-center justify-center select-none px-6">
            {buttonContent}
            {/* Optional glossy overlay from your Figma fill @ ~38% */}
            <span className="pointer-events-none absolute inset-0 rounded-[43.5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_60%)] opacity-40" />
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

'use client';

import Link from 'next/link';

const SIZE_CLASSES = {
  sm: 'h-12 px-6 text-sm',
  md: 'h-14 px-8 text-base',
  lg: 'h-16 px-10 text-lg',
};

const VARIANT_CLASSES = {
  primary: `
    bg-gradient-to-r from-[#296AFF] to-[#FF7D2B]
    text-white shadow-lg shadow-[#296AFF]/30
    hover:shadow-[0_0_40px_rgba(41,106,255,0.6),0_0_60px_rgba(255,125,43,0.4)]
  `,
  secondary: `
    bg-transparent text-white/90 border-2 border-white/30
    hover:border-white/60 hover:bg-white/10
  `,
};

export default function UnifiedCTA({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  text = 'Run My Free Audit',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  showArrow = true,
  loading = false,
}: {
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
}) {
  const base = `
    relative group inline-flex items-center justify-center
    font-bold rounded-full transition-all duration-300 ease-out
    focus:outline-none focus:ring-4 focus:ring-white/30
    hover:scale-105 active:scale-95 overflow-hidden
    disabled:opacity-50 disabled:cursor-not-allowed
    border-0 outline-none
    active:border-0 active:outline-none
  `;

  const shine = `
    before:content-[''] before:absolute before:inset-0
    before:bg-gradient-to-b before:from-white/20 before:via-transparent before:to-transparent
    before:opacity-50 before:pointer-events-none before:rounded-full
  `;

  const classes = [
    base,
    shine,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const inner = (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        <span>{text}</span>
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

  return href ? <Link href={href} className={fullWidth ? 'block w-full' : ''}>{inner}</Link> : inner;
}
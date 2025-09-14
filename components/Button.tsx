import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation';
  
  const variantClasses = {
    primary: 'relative overflow-hidden focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0B0B0C] hover:shadow-[0_0_40px_rgba(41,106,255,0.6)] hover:shadow-[0_0_60px_rgba(255,125,43,0.4)] hover:-translate-y-1 active:translate-y-0 disabled:hover:translate-y-0 disabled:hover:shadow-none bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] text-white transition-all duration-300 ease-out group shadow-lg shadow-[#296AFF]/30',
    secondary: 'border-2 border-white/20 text-white/90 hover:border-[#FF7D2B] hover:bg-[#FF7D2B]/10 transition-all duration-300 focus:ring-2 focus:ring-[#FF7D2B]/50 focus:ring-offset-2 focus:ring-offset-[#0B0B0C] bg-[#0B0B0C] backdrop-blur-sm hover:shadow-lg hover:shadow-[#FF7D2B]/20',
    ghost: 'text-white/90 hover:bg-white/5 focus:ring-white/20 rounded-lg border border-transparent hover:border-white/10',
  };
  
  const sizeClasses = {
    sm: 'h-12 px-5 text-sm py-3',
    md: 'h-14 px-7 text-base py-4 md:py-5 md:px-10',
    lg: 'h-16 px-9 text-lg py-4 md:py-5 md:px-12',
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Content */}
      <span className="relative z-10 flex-1 text-white font-bold leading-tight inline-flex items-center justify-center select-none h-full tracking-wide">
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
        
        {/* Arrow icon for primary buttons */}
        {variant === 'primary' && !loading && (
          <svg 
            className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        )}
      </span>
      
      {/* Subtle inner highlight for depth on primary buttons */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-50" />
      )}
    </button>
  );
}

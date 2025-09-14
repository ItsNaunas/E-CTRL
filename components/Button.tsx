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
    primary: 'relative rounded-full focus:ring-white/20 hover:shadow-lg hover:shadow-[#296AFF]/25 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:hover:shadow-none bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] text-white md:p-[1.5px] md:bg-gradient-to-r md:from-[#296AFF] md:to-[#FF7D2B]',
    secondary: 'border border-white/10 text-white/90 hover:border-white/20 hover:bg-white/5 transition focus:ring-white/20 rounded-full bg-[#0B0B0C]',
    ghost: 'text-white/90 hover:bg-white/5 focus:ring-white/20 rounded-full',
  };
  
  const sizeClasses = {
    sm: 'h-11 px-4 text-sm py-3',
    md: 'h-12 px-6 text-base py-3 md:py-4 md:px-8',
    lg: 'h-14 px-8 text-lg py-3 md:py-4 md:px-8',
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {variant === 'primary' ? (
        <>
          {/* Mobile: Simple gradient background */}
          <span className="relative flex-1 rounded-full bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] text-white font-semibold leading-tight inline-flex items-center justify-center select-none h-full md:hidden">
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
          </span>
          {/* Desktop: Layered black-on-gradient */}
          <span className="relative flex-1 rounded-full bg-black text-white font-semibold leading-tight inline-flex items-center justify-center select-none h-full hidden md:inline-flex">
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
            {/* Subtle glossy overlay for desktop */}
            <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/20 via-white/5 to-transparent opacity-30" />
          </span>
        </>
      ) : (
        <>
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
        </>
      )}
    </button>
  );
}

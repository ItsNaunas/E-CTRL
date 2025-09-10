import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'relative inline-flex h-[60px] rounded-[45px] p-[1.5px] bg-[linear-gradient(90deg,#296AFF_0%,#FF7D2B_100%)] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_8px_32px_rgba(41,106,255,0.3)] hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-[0_0_0_0_rgba(0,0,0,0)]',
    secondary: 'border border-white/15 text-white/90 hover:border-white/40 hover:bg-white/5 transition focus:ring-white/20',
    ghost: 'text-white/90 hover:bg-white/5 focus:ring-white/20',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-sm min-h-[44px]',
    lg: 'px-6 py-3 text-base min-h-[48px]',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {variant === 'primary' ? (
        <>
          {/* Inner fill (pure black) */}
          <span className="relative flex-1 rounded-[43.5px] bg-black text-white font-medium text-base leading-none inline-flex items-center justify-center select-none px-6">
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
            {/* Optional glossy overlay from your Figma fill @ ~38% */}
            <span className="pointer-events-none absolute inset-0 rounded-[43.5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_60%)] opacity-40" />
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

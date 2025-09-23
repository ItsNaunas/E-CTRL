import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  help?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, help, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white"
          >
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`block w-full rounded-xl bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-[#007AFF]/50 focus:ring-2 focus:ring-[#007AFF]/30 px-4 py-3 transition outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''
          } ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : help ? `${inputId}-help` : undefined
          }
          {...props}
        />
        
        {help && !error && (
          <p id={`${inputId}-help`} className="text-sm text-white/60">
            {help}
          </p>
        )}
        
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

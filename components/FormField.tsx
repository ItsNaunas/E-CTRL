import { ReactNode } from 'react';

interface FormFieldProps {
  children: ReactNode;
  className?: string;
}

export default function FormField({ children, className = '' }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
}

'use client';

import { useEffect, ReactNode } from 'react';
import { errorHandler } from '@/lib/errorHandler';

interface ErrorHandlerProviderProps {
  children: ReactNode;
}

export function ErrorHandlerProvider({ children }: ErrorHandlerProviderProps) {
  useEffect(() => {
    // Initialize global error handler on mount
    errorHandler.initialize();

    // Cleanup on unmount
    return () => {
      errorHandler.cleanup();
    };
  }, []);

  return <>{children}</>;
}

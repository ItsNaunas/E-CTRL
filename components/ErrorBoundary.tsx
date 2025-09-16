'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import UnifiedCTA from './UnifiedCTA';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'global' | 'component' | 'critical';
  context?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: Math.random().toString(36).substring(7)
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substring(7)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to external service in production
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: `${this.props.context || 'Unknown'}: ${error.message}`,
        fatal: this.props.level === 'critical',
        error_id: this.state.errorId
      });
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: Math.random().toString(36).substring(7)
    });
  };

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback based on error level
      return (
        <ErrorFallback
          level={this.props.level || 'component'}
          context={this.props.context}
          error={this.state.error}
          errorId={this.state.errorId}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

// Fallback UI component
interface ErrorFallbackProps {
  level: 'global' | 'component' | 'critical';
  context?: string;
  error?: Error;
  errorId: string;
  onRetry: () => void;
  onReload: () => void;
}

function ErrorFallback({ level, context, error, errorId, onRetry, onReload }: ErrorFallbackProps) {
  const getErrorConfig = () => {
    switch (level) {
      case 'global':
        return {
          title: 'Something went wrong',
          description: 'We encountered an unexpected error. Please try refreshing the page.',
          showDetails: false,
          primaryAction: { text: 'Reload Page', action: onReload },
          secondaryAction: { text: 'Try Again', action: onRetry }
        };
      case 'critical':
        return {
          title: 'Critical Error',
          description: 'A critical component failed to load. Please refresh the page or contact support if the issue persists.',
          showDetails: process.env.NODE_ENV === 'development',
          primaryAction: { text: 'Reload Page', action: onReload },
          secondaryAction: null
        };
      case 'component':
      default:
        return {
          title: 'Component Error',
          description: `There was an issue loading ${context || 'this section'}. You can try again or continue using other features.`,
          showDetails: false,
          primaryAction: { text: 'Try Again', action: onRetry },
          secondaryAction: { text: 'Reload Page', action: onReload }
        };
    }
  };

  const config = getErrorConfig();

  return (
    <div className={`
      flex flex-col items-center justify-center p-8 rounded-lg border text-center
      ${level === 'global' ? 'min-h-[50vh] bg-red-500/10 border-red-500/20' : 
        level === 'critical' ? 'min-h-[30vh] bg-orange-500/10 border-orange-500/20' :
        'min-h-[200px] bg-white/5 border-white/10'}
    `}>
      {/* Error Icon */}
      <div className={`
        w-16 h-16 rounded-full flex items-center justify-center mb-4
        ${level === 'global' ? 'bg-red-500/20' : 
          level === 'critical' ? 'bg-orange-500/20' : 
          'bg-white/10'}
      `}>
        <svg 
          className={`w-8 h-8 ${
            level === 'global' ? 'text-red-400' :
            level === 'critical' ? 'text-orange-400' :
            'text-white/70'
          }`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>

      {/* Error Content */}
      <h3 className="text-xl font-semibold text-white mb-2">
        {config.title}
      </h3>
      <p className="text-white/70 mb-6 max-w-md">
        {config.description}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        <UnifiedCTA
          variant="primary"
          size="md"
          text={config.primaryAction.text}
          onClick={config.primaryAction.action}
        />
        {config.secondaryAction && (
          <UnifiedCTA
            variant="secondary"
            size="md"
            text={config.secondaryAction.text}
            onClick={config.secondaryAction.action}
          />
        )}
      </div>

      {/* Error Details (Development Only) */}
      {config.showDetails && error && (
        <details className="mt-4 w-full max-w-2xl">
          <summary className="cursor-pointer text-sm text-white/60 hover:text-white/80">
            Show Error Details (Error ID: {errorId})
          </summary>
          <div className="mt-2 p-4 bg-black/20 rounded border border-white/10 text-left">
            <pre className="text-xs text-red-300 whitespace-pre-wrap overflow-auto">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </div>
        </details>
      )}

      {/* Support Info */}
      <p className="text-xs text-white/40 mt-4">
        Error ID: {errorId} | Need help? Contact support with this ID.
      </p>
    </div>
  );
}

// Wrapper function component for hooks
export default function ErrorBoundary(props: Props) {
  return <ErrorBoundaryClass {...props} />;
}

// Export specific boundary types for convenience
export function GlobalErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary level="global" context="Application">
      {children}
    </ErrorBoundary>
  );
}

export function ComponentErrorBoundary({ 
  children, 
  context 
}: { 
  children: ReactNode; 
  context: string;
}) {
  return (
    <ErrorBoundary level="component" context={context}>
      {children}
    </ErrorBoundary>
  );
}

export function CriticalErrorBoundary({ 
  children, 
  context 
}: { 
  children: ReactNode; 
  context: string;
}) {
  return (
    <ErrorBoundary level="critical" context={context}>
      {children}
    </ErrorBoundary>
  );
}

/**
 * Global error handling utilities
 * Handles unhandled promise rejections and global errors
 */

// Error reporting interface
interface ErrorReport {
  message: string;
  stack?: string;
  url?: string;
  line?: number;
  column?: number;
  timestamp: string;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  errorId: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private isInitialized = false;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  initialize() {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    
    // Handle global JavaScript errors
    window.addEventListener('error', this.handleGlobalError);

    // Handle resource loading errors
    window.addEventListener('error', this.handleResourceError, true);

    this.isInitialized = true;
    console.log('Global error handler initialized');
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    
    const errorReport: ErrorReport = {
      message: `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`,
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      errorId: this.generateErrorId()
    };

    this.reportError(errorReport, 'promise_rejection');
    
    // Prevent the default browser console error
    event.preventDefault();
  };

  private handleGlobalError = (event: ErrorEvent) => {
    console.error('Global JavaScript Error:', event.error);
    
    const errorReport: ErrorReport = {
      message: event.message,
      stack: event.error?.stack,
      url: event.filename,
      line: event.lineno,
      column: event.colno,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      errorId: this.generateErrorId()
    };

    this.reportError(errorReport, 'javascript_error');
  };

  private handleResourceError = (event: Event) => {
    const target = event.target;
    
    // Only handle resource loading errors (img, script, link, etc.)
    if (!target || !(target instanceof HTMLElement)) return;

    console.error('Resource loading error:', target);
    
    const errorReport: ErrorReport = {
      message: `Failed to load resource: ${target.tagName}`,
      url: (target as any).src || (target as any).href,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      errorId: this.generateErrorId()
    };

    this.reportError(errorReport, 'resource_error');
  };

  private reportError(errorReport: ErrorReport, errorType: string) {
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: errorReport.message,
        fatal: false,
        error_type: errorType,
        error_id: errorReport.errorId
      });
    }

    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.group(`${errorType.toUpperCase()}`);
      console.error('Error Report:', errorReport);
      console.groupEnd();
    }

    // In production, you might want to send to an error reporting service
    // this.sendToErrorService(errorReport);
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  // Method to manually report errors from components
  public reportComponentError(error: Error, context: string, additionalInfo?: Record<string, any>) {
    const errorReport: ErrorReport = {
      message: `Component Error in ${context}: ${error.message}`,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      errorId: this.generateErrorId()
    };

    console.error('Component Error:', { error, context, additionalInfo });
    this.reportError(errorReport, 'component_error');
  }

  // Method to report API errors
  public reportApiError(endpoint: string, status: number, error: any) {
    const errorReport: ErrorReport = {
      message: `API Error: ${endpoint} returned ${status}`,
      stack: error?.stack || JSON.stringify(error),
      url: endpoint,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      errorId: this.generateErrorId()
    };

    this.reportError(errorReport, 'api_error');
  }

  // Cleanup method
  cleanup() {
    if (typeof window === 'undefined' || !this.isInitialized) {
      return;
    }

    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('error', this.handleResourceError, true);
    
    this.isInitialized = false;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Export utility function for easy component error reporting
export function reportError(error: Error, context: string, additionalInfo?: Record<string, any>) {
  errorHandler.reportComponentError(error, context, additionalInfo);
}

// Export utility function for API error reporting
export function reportApiError(endpoint: string, status: number, error: any) {
  errorHandler.reportApiError(endpoint, status, error);
}

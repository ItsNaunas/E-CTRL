// Centralized environment variable validation
// This prevents runtime crashes from missing environment variables

export interface Environment {
  // API Keys
  OPENAI_API_KEY: string;
  RESEND_API_KEY: string;
  
  // Supabase
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  
  // Next.js
  NODE_ENV: 'development' | 'production' | 'test';
  VERCEL?: string;
  
  // Public Supabase (fallbacks)
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

/**
 * Validates and returns a required environment variable
 * Throws EnvironmentError if missing or empty
 */
function requireEnv(key: keyof Environment): string {
  const value = process.env[key];
  
  if (!value || value.trim() === '') {
    throw new EnvironmentError(
      `Missing required environment variable: ${key}. Please check your .env.local file.`
    );
  }
  
  return value.trim();
}

/**
 * Gets an optional environment variable with fallback
 */
function getEnv(key: keyof Environment, fallback?: string): string | undefined {
  const value = process.env[key];
  return value?.trim() || fallback;
}

/**
 * Validates all required environment variables at startup
 * Call this in your API routes to ensure they have required config
 */
export function validateRequiredEnv(context: 'api' | 'client' | 'build' = 'api'): void {
  const errors: string[] = [];
  
  try {
    if (context === 'api') {
      // Required for API routes
      requireEnv('OPENAI_API_KEY');
      requireEnv('RESEND_API_KEY');
      
      // Supabase - try public first, then private
      const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('SUPABASE_URL');
      if (!supabaseUrl) {
        errors.push('SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
      }
      
      const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');
      if (!supabaseAnonKey) {
        errors.push('SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
      }
      
      requireEnv('SUPABASE_SERVICE_ROLE_KEY');
    }
    
    if (errors.length > 0) {
      throw new EnvironmentError(
        `Missing required environment variables: ${errors.join(', ')}. Please check your .env.local file.`
      );
    }
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw error;
  }
}

/**
 * Safe getters for environment variables with validation
 */
export const env = {
  // API Keys
  openai: () => requireEnv('OPENAI_API_KEY'),
  resend: () => requireEnv('RESEND_API_KEY'),
  
  // Supabase
  supabaseUrl: () => getEnv('NEXT_PUBLIC_SUPABASE_URL') || requireEnv('SUPABASE_URL'),
  supabaseAnonKey: () => getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || requireEnv('SUPABASE_ANON_KEY'),
  supabaseServiceKey: () => requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  
  // Next.js
  isDevelopment: () => getEnv('NODE_ENV') === 'development',
  isProduction: () => getEnv('NODE_ENV') === 'production',
  isVercel: () => !!getEnv('VERCEL'),
} as const;

// Type-safe environment access
export { requireEnv, getEnv, EnvironmentError };

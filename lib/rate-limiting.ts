// Advanced Rate Limiting System for E-CTRL
// Provides granular control over different types of operations

import { supabaseAdmin } from './supabase';
import type { AuditType, AccessType } from './supabase';

export interface RateLimitConfig {
  operation: 'analysis' | 'scraping' | 'suggestions' | 'email';
  limits: {
    guest: { count: number; windowHours: number };
    account: { count: number; windowHours: number };
  };
  costWeight?: number; // For AI operations, weight by cost
}

// Rate limit configurations for different operations
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // AI Analysis - Most expensive, strictest limits
  analysis: {
    operation: 'analysis',
    limits: {
      guest: { count: 1, windowHours: 24 },      // 1 per day
      account: { count: 5, windowHours: 24 },    // 5 per day
    },
    costWeight: 1.0
  },
  
  // Preview Analysis - Same as full analysis since it uses AI
  preview: {
    operation: 'analysis',
    limits: {
      guest: { count: 3, windowHours: 24 },      // 3 previews per day
      account: { count: 10, windowHours: 24 },   // 10 previews per day
    },
    costWeight: 0.8 // Slightly cheaper than full analysis
  },
  
  // Web Scraping - Moderate limits to prevent IP bans
  scraping: {
    operation: 'scraping',
    limits: {
      guest: { count: 5, windowHours: 1 },       // 5 per hour
      account: { count: 20, windowHours: 1 },    // 20 per hour
    },
    costWeight: 0.1
  },
  
  // AI Suggestions - Light AI usage
  suggestions: {
    operation: 'suggestions',
    limits: {
      guest: { count: 3, windowHours: 1 },       // 3 per hour
      account: { count: 15, windowHours: 1 },    // 15 per hour
    },
    costWeight: 0.2
  },
  
  // Email Delivery - Should be unrestricted after valid analysis
  email: {
    operation: 'email',
    limits: {
      guest: { count: 999, windowHours: 1 },     // Effectively unlimited
      account: { count: 999, windowHours: 1 },   // Effectively unlimited
    },
    costWeight: 0.01
  }
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  config: RateLimitConfig;
  message?: string;
}

/**
 * Check rate limit for a specific operation
 */
export async function checkOperationRateLimit(
  email: string,
  operation: keyof typeof RATE_LIMIT_CONFIGS,
  accessType: AccessType = 'guest',
  identifier?: string // Optional: for operation-specific tracking (e.g., ASIN)
): Promise<RateLimitResult> {
  const config = RATE_LIMIT_CONFIGS[operation];
  const limits = config.limits[accessType];
  
  try {
    // Create a unique key for this operation type
    const operationKey = identifier ? `${operation}_${identifier}` : operation;
    
    const { data, error } = await supabaseAdmin.rpc('check_operation_rate_limit', {
      p_email: email,
      p_operation: operationKey,
      p_access_type: accessType,
      p_limit_count: limits.count,
      p_window_hours: limits.windowHours
    });
    
    if (error) {
      console.error('Rate limit check error:', error);
      // Fail open - allow the request if we can't check limits
      return {
        allowed: true,
        remaining: limits.count,
        resetTime: new Date(Date.now() + limits.windowHours * 60 * 60 * 1000),
        config
      };
    }
    
    const result = data as { allowed: boolean; current_count: number; reset_time: string };
    
    return {
      allowed: result.allowed,
      remaining: Math.max(0, limits.count - result.current_count),
      resetTime: new Date(result.reset_time),
      config,
      message: result.allowed ? undefined : generateRateLimitMessage(operation, accessType, limits)
    };
    
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open
    return {
      allowed: true,
      remaining: limits.count,
      resetTime: new Date(Date.now() + limits.windowHours * 60 * 60 * 1000),
      config
    };
  }
}

/**
 * Generate user-friendly rate limit messages
 */
function generateRateLimitMessage(
  operation: keyof typeof RATE_LIMIT_CONFIGS,
  accessType: AccessType,
  limits: { count: number; windowHours: number }
): string {
  const timeWindow = limits.windowHours === 1 ? 'hour' : 
                   limits.windowHours === 24 ? 'day' : 
                   `${limits.windowHours} hours`;
  
  const upgradeMessage = accessType === 'guest' 
    ? ' Create a free account for higher limits!' 
    : '';
  
  switch (operation) {
    case 'analysis':
    case 'preview':
      return `Analysis limit reached: ${limits.count} per ${timeWindow}.${upgradeMessage}`;
    
    case 'scraping':
      return `Too many requests: ${limits.count} per ${timeWindow}. Please wait before trying again.${upgradeMessage}`;
    
    case 'suggestions':
      return `Suggestion limit reached: ${limits.count} per ${timeWindow}.${upgradeMessage}`;
    
    default:
      return `Rate limit exceeded: ${limits.count} per ${timeWindow}.${upgradeMessage}`;
  }
}

/**
 * Record a successful operation (for analytics and cost tracking)
 */
export async function recordOperation(
  email: string,
  operation: keyof typeof RATE_LIMIT_CONFIGS,
  accessType: AccessType = 'guest',
  metadata?: any
) {
  try {
    await supabaseAdmin.rpc('record_operation_usage', {
      p_email: email,
      p_operation: operation,
      p_access_type: accessType,
      p_cost_weight: RATE_LIMIT_CONFIGS[operation].costWeight || 1.0,
      p_metadata: metadata
    });
  } catch (error) {
    console.error('Failed to record operation:', error);
    // Don't fail the request if we can't record usage
  }
}

/**
 * Get usage statistics for a user
 */
export async function getUserUsageStats(email: string): Promise<any> {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_user_usage_stats', {
      p_email: email
    });
    
    if (error) {
      console.error('Failed to get usage stats:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Usage stats query failed:', error);
    return null;
  }
}

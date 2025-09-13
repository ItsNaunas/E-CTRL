import { createClient } from '@supabase/supabase-js';
import { env } from './env';

const supabaseUrl = env.supabaseUrl();
const supabaseAnonKey = env.supabaseAnonKey();
const supabaseServiceKey = env.supabaseServiceKey();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create client with anon key for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create service role client for server-side operations (if service key is available)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback to regular client if no service key

// Database types based on your schema
export type AuditType = 'existing_seller' | 'new_seller';
export type FulfilmentType = 'FBA' | 'FBM' | 'Unsure';
export type ReportStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type AccessType = 'guest' | 'account';

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
  email_verified: boolean;
  verification_token?: string;
  reset_token?: string;
  reset_token_expires?: string;
}

export interface Lead {
  id: string;
  email: string;
  name: string;
  phone?: string;
  audit_type: AuditType;
  
  // Existing seller fields
  asin?: string;
  keywords?: string[];
  fulfilment?: FulfilmentType;
  
  // New seller fields
  website_url?: string;
  no_website_desc?: string;
  category?: string;
  product_desc?: string;
  fulfilment_intent?: FulfilmentType;
  
  // Metadata
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface Report {
  id: string;
  lead_id: string;
  user_id?: string;
  
  // Report data
  score: number;
  highlights: string[];
  recommendations: string[];
  detailed_analysis?: any;
  
  // Metadata
  status: ReportStatus;
  generated_at: string;
  delivered_at?: string;
  email_sent: boolean;
  email_sent_at?: string;
  
  // Access
  access_type: AccessType;
  
  created_at: string;
  updated_at: string;
}

// Extended Report interface for joined queries with lead data
export interface ReportWithLead extends Report {
  leads: Lead;
}

export interface RateLimit {
  id: string;
  email: string;
  audit_type: AuditType;
  last_request_at: string;
  request_count: number;
}

export interface EmailLog {
  id: string;
  report_id: string;
  email: string;
  template_name: string;
  status: string;
  message_id?: string;
  error_message?: string;
  sent_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  event_data?: any;
  user_id?: string;
  lead_id?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  page_url?: string;
  referrer?: string;
  created_at: string;
}

// Database table names
export const TABLES = {
  USERS: 'users',
  LEADS: 'leads',
  REPORTS: 'reports',
  RATE_LIMITS: 'rate_limits',
  EMAIL_LOGS: 'email_logs',
  ANALYTICS_EVENTS: 'analytics_events',
} as const;

// Centralized constants to prevent enum drift and magic strings
import type { AuditType, FulfilmentType } from './supabase';

// Audit types - imported from schema
export const AUDIT_TYPES = {
  EXISTING_SELLER: 'existing_seller' as const,
  NEW_SELLER: 'new_seller' as const,
} satisfies Record<string, AuditType>;

// Fulfilment types - imported from schema  
export const FULFILMENT_TYPES = {
  FBA: 'FBA' as const,
  FBM: 'FBM' as const,
  UNSURE: 'Unsure' as const,
} satisfies Record<string, FulfilmentType>;

// Sample data constants
export const SAMPLE_DATA = {
  KEYWORDS: ["eco friendly", "sustainable", "organic"],
  DEFAULT_FULFILMENT: FULFILMENT_TYPES.FBA,
  DEFAULT_CATEGORY: "Home & Garden",
  DEFAULT_DESCRIPTION: "Eco-friendly product for sustainable living",
} as const;

// File constants
export const FILE_CONSTANTS = {
  PLACEHOLDER_IMAGE: {
    name: "placeholder.jpg",
    size: 1024,
    type: "image/jpeg"
  }
} as const;

// Email constants
export const EMAIL_CONSTANTS = {
  PREVIEW_EMAIL: 'preview@example.com',
  DEFAULT_NAME_PREFIX: 'User',
} as const;

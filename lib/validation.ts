import { z } from 'zod';

// Basic validation schemas
export const name = z.string().min(1, "Name is required").max(100, "Name too long");
export const email = z.string().email("Invalid email format");
export const phone = z.string().optional(); // Basic; refine later per region

// ASIN validation - supports both ASIN codes and full URLs with comprehensive patterns
export const asin = z
  .string()
  .min(1, "ASIN or URL is required")
  .refine((value) => {
    // Check if it's a 10-character ASIN
    const asinRegex = /^[A-Z0-9]{10}$/;
    if (asinRegex.test(value)) return true;
    
    // Check if it's a valid Amazon URL containing an ASIN
    try {
      const url = new URL(value);
      
      // Check if it's an Amazon domain
      const isAmazonDomain = url.hostname.includes('amazon') || 
                            url.hostname.includes('amzn.') || 
                            url.hostname.includes('a.co');
      
      if (!isAmazonDomain) return false;
      
      // Comprehensive ASIN extraction patterns
      const amazonPatterns = [
        // Standard dp/product patterns
        /(?:[/dp/]|product[/]|gp\/product\/)([A-Z0-9]{10})(?:[/?&]|$)/,
        // Shortened URLs
        /(?:amzn\.to\/|a\.co\/d\/|amzn\.com\/)([A-Z0-9]{10})(?:[/?&]|$)/,
        // Mobile/Smile domains
        /(?:m\.|smile\.)?amazon\.[a-z.]+\/(?:dp\/|product\/|gp\/product\/)([A-Z0-9]{10})(?:[/?&]|$)/,
        // Handle URLs with product names before ASIN
        /\/dp\/([A-Z0-9]{10})(?:[/?&]|$)/,
        // Handle product URLs
        /\/product\/([A-Z0-9]{10})(?:[/?&]|$)/,
        // Handle gp/product URLs
        /\/gp\/product\/([A-Z0-9]{10})(?:[/?&]|$)/
      ];
      
      // Try each pattern
      for (const pattern of amazonPatterns) {
        const match = url.pathname.match(pattern);
        if (match && match[1] && match[1].length === 10 && /^[A-Z0-9]{10}$/.test(match[1])) {
          return true;
        }
      }
      
      return false;
    } catch {
      return false;
    }
  }, "Enter a valid 10-character ASIN or Amazon product URL");

// Keywords validation
export const keywords = z
  .array(z.string().min(1))
  .max(8, "Max 8 keywords.")
  .optional();

export const requiredKeywords = z
  .array(z.string().min(1))
  .min(1, "At least 1 keyword required")
  .max(8, "Max 8 keywords.");

// Product description validation
export const shortDesc = z
  .string()
  .min(10, "Description must be at least 10 characters")
  .max(2000, "Description too long");

// Category validation
export const category = z
  .string()
  .min(1, "Category is required")
  .max(100, "Category name too long");

// Product URL validation for new sellers
export const productUrl = z
  .string()
  .url("Invalid URL format")
  .refine((url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:';
    } catch {
      return false;
    }
  }, "Invalid URL format");

// Existing seller schema
export const existingSellerSchema = z.object({
  asin: asin,
  keywords: requiredKeywords,
  fulfilment: z.enum(['FBA', 'FBM', 'Unsure'], {
    errorMap: () => ({ message: "Select FBA, FBM, or Unsure" })
  }),
  name: name,
  email: email
});

// New seller schema  
export const newSellerSchema = z.object({
  websiteUrl: productUrl,
  desc: shortDesc,
  category: category,
  keywords: requiredKeywords,
  name: name,
  email: email
});

// Type exports
export type ExistingSellerData = z.infer<typeof existingSellerSchema>;
export type NewSellerData = z.infer<typeof newSellerSchema>;
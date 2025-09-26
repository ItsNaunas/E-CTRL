// Updated product scraper with enhanced rating extraction
// This shows the exact changes needed for lib/product-scraper.ts

import { extractGenericRating } from './rating-extractor';

// In the extractRating function (lines 327-341), replace with:

function extractRating(html: string): string | undefined {
  return extractGenericRating(html);
}

// This replaces the entire function with a call to the shared utility

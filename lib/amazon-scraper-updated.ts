// Updated Amazon scraper with enhanced rating extraction
// This shows the exact changes needed for lib/amazon-scraper.ts

import { extractRatingFromHtml } from './rating-extractor';

// In the scrapeAmazonProductCheerio function, replace the rating extraction section (lines 222-252) with:

    // Extract rating using enhanced patterns (shared utility)
    const extractedRating = extractRatingFromHtml(html);
    if (extractedRating !== null) {
      productData.rating = extractedRating;
    }

// Remove the old rating extraction code (lines 222-252) and replace with the above 4 lines

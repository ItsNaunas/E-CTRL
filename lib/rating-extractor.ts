// Enhanced rating extraction utility - used by all scrapers and evaluators
// This ensures consistent rating extraction across the entire application

export function extractRatingFromHtml(html: string): number | null {
  // Use flexible patterns to handle Amazon's changing HTML structure
  const ratingPatterns = [
    // Common rating patterns from product pages
    /<span[^>]*class="a-icon-alt"[^>]*>([^<]+)<\/span>/,
    /<span[^>]*class="a-icon a-icon-star a-star-([0-9]+)"[^>]*><\/span>/,
    /(\d+\.?\d*)\s+out\s+of\s+5\s+stars/i,
    /<span[^>]*id="acrPopover"[^>]*>[\s\S]*?aria-label="([^"]+)"/,
    /<span[^>]*class="a-offscreen"[^>]*>([^<]*out of[^<]*)<\/span>/,
    /data-hook="average-star-rating"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/
  ];
  
  for (const pattern of ratingPatterns) {
    const ratingMatch = html.match(pattern);
    if (ratingMatch) {
      if (pattern === ratingPatterns[1]) {
        // Handle star rating pattern (convert from 100-point to 5-point scale)
        const starValue = parseInt(ratingMatch[1]);
        if (starValue >= 0 && starValue <= 100) {
          return starValue / 20; // Convert 0-100 to 0-5 scale
        }
      } else {
        const ratingText = ratingMatch[1];
        const ratingNumMatch = ratingText.match(/(\d+\.?\d*)/);
        if (ratingNumMatch) {
          const rating = parseFloat(ratingNumMatch[1]);
          // Ensure rating is in valid range (0-5)
          if (rating >= 0 && rating <= 5) {
            return rating;
          }
        }
      }
    }
  }
  
  return null;
}

// Generic rating extraction for non-Amazon sites
export function extractGenericRating(html: string): string | undefined {
  const patterns = [
    /<meta[^>]*property="product:rating"[^>]*content="([^"]+)"/i,
    /<span[^>]*class="[^"]*rating[^"]*"[^>]*>([^<]+)<\/span>/i,
    /<div[^>]*class="[^"]*rating[^"]*"[^>]*>([^<]+)<\/div>/i,
    /<span[^>]*class="[^"]*star[^"]*"[^>]*>([^<]+)<\/span>/i,
    /(\d+\.?\d*)\s*\/\s*5/i,
    /(\d+\.?\d*)\s*out\s+of\s+5/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

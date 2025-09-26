// This is a temporary file to show the exact changes needed for lib/amazon-scraper.ts
// Replace lines 222-252 in lib/amazon-scraper.ts with this enhanced rating extraction:

    // Extract rating using enhanced patterns (same as IDQ evaluator)
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
            productData.rating = starValue / 20; // Convert 0-100 to 0-5 scale
            break;
          }
        } else {
          const ratingText = ratingMatch[1];
          const ratingNumMatch = ratingText.match(/(\d+\.?\d*)/);
          if (ratingNumMatch) {
            const rating = parseFloat(ratingNumMatch[1]);
            // Ensure rating is in valid range (0-5)
            if (rating >= 0 && rating <= 5) {
              productData.rating = rating;
              break;
            }
          }
        }
      }
    }

// Simple Amazon scraper without external dependencies for Next.js compatibility

export interface AmazonProductData {
  asin: string;
  title: string;
  bullets: string[];
  description: string;
  images: string[];
  price: string;
  rating: number;
  reviewCount: number;
  availability: string;
  brand: string;
  category: string;
  features: string[];
  specifications: Record<string, string>;
}

export interface ScrapingError {
  error: string;
  code: string;
  details?: any;
}

// Extract ASIN from Amazon URL or validate ASIN format
export function extractASIN(input: string): string | null {
  // If it's already an ASIN (10 alphanumeric characters)
  if (/^[A-Z0-9]{10}$/.test(input)) {
    return input;
  }
  
  // Try to extract from various Amazon URL patterns
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/,
    /\/product\/([A-Z0-9]{10})/,
    /\/gp\/product\/([A-Z0-9]{10})/,
    /asin=([A-Z0-9]{10})/,
    /\/[A-Z0-9]{10}\//
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

// Simplified scraping function (Cheerio only for now)
export async function scrapeAmazonProduct(asin: string): Promise<AmazonProductData | ScrapingError> {
  // For now, use the Cheerio implementation
  return await scrapeAmazonProductCheerio(asin);
}

// Simplified scraping method using fetch (Next.js compatible)
export async function scrapeAmazonProductCheerio(asin: string): Promise<AmazonProductData | ScrapingError> {
  if (!asin || asin.length !== 10) {
    return {
      error: 'Invalid ASIN format',
      code: 'INVALID_ASIN'
    };
  }

  try {
    const url = `https://www.amazon.co.uk/dp/${asin}`;
    console.log(`Scraping Amazon product: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      return {
        error: 'Failed to fetch product page',
        code: 'FETCH_FAILED',
        details: `HTTP ${response.status}`
      };
    }

    const html = await response.text();

    // Simple regex-based extraction (more reliable than DOM parsing for serverless)
    const productData: AmazonProductData = {
      asin,
      title: '',
      bullets: [],
      description: '',
      images: [],
      price: '',
      rating: 0,
      reviewCount: 0,
      availability: '',
      brand: '',
      category: '',
      features: [],
      specifications: {}
    };

    // Extract title using regex
    const titleMatch = html.match(/<span[^>]*id="productTitle"[^>]*>([^<]+)<\/span>/);
    if (titleMatch) {
      productData.title = titleMatch[1].trim();
    }

    // Extract price using regex
    const priceMatch = html.match(/<span[^>]*class="a-price-whole"[^>]*>([^<]+)<\/span>/);
    if (priceMatch) {
      productData.price = priceMatch[1].trim();
    }

    // Extract rating using regex
    const ratingMatch = html.match(/<span[^>]*class="a-icon-alt"[^>]*>([^<]+)<\/span>/);
    if (ratingMatch) {
      const ratingText = ratingMatch[1];
      const ratingNumMatch = ratingText.match(/(\d+\.?\d*)/);
      if (ratingNumMatch) {
        productData.rating = parseFloat(ratingNumMatch[1]);
      }
    }

    // Extract review count using regex
    const reviewMatch = html.match(/<span[^>]*id="acrCustomerReviewText"[^>]*>([^<]+)<\/span>/);
    if (reviewMatch) {
      const reviewText = reviewMatch[1];
      const reviewNumMatch = reviewText.match(/([\d,]+)/);
      if (reviewNumMatch) {
        productData.reviewCount = parseInt(reviewNumMatch[1].replace(/,/g, ''));
      }
    }

    // Extract bullets using regex
    const bulletMatches = html.match(/<span[^>]*class="a-list-item"[^>]*>([^<]+)<\/span>/g);
    if (bulletMatches) {
      bulletMatches.forEach(match => {
        const textMatch = match.match(/<span[^>]*class="a-list-item"[^>]*>([^<]+)<\/span>/);
        if (textMatch) {
          const text = textMatch[1].trim();
          if (text && text.length > 10) {
            productData.bullets.push(text);
          }
        }
      });
    }

    // Extract brand using regex
    const brandMatch = html.match(/<span[^>]*id="bylineInfo"[^>]*>([^<]+)<\/span>/);
    if (brandMatch) {
      productData.brand = brandMatch[1].trim();
    }

    // Extract availability using regex
    const availabilityMatch = html.match(/<span[^>]*id="availability"[^>]*>([^<]+)<\/span>/);
    if (availabilityMatch) {
      productData.availability = availabilityMatch[1].trim();
    }

    // Extract images using regex
    const imageMatches = html.match(/<img[^>]*src="([^"]*amazon[^"]*)"[^>]*>/g);
    if (imageMatches) {
      imageMatches.forEach(match => {
        const srcMatch = match.match(/src="([^"]*)"/);
        if (srcMatch) {
          productData.images.push(srcMatch[1]);
        }
      });
    }

    // Validate essential data
    if (!productData.title) {
      return {
        error: 'Product not found or page structure changed',
        code: 'PRODUCT_NOT_FOUND'
      };
    }

    console.log(`Successfully scraped product: ${productData.title}`);
    return productData;

  } catch (error) {
    console.error('Scraping error:', error);
    return {
      error: 'Failed to scrape product data',
      code: 'SCRAPING_FAILED',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Main scraping function
export async function scrapeProduct(asinOrUrl: string): Promise<AmazonProductData | ScrapingError> {
  const asin = extractASIN(asinOrUrl);
  
  if (!asin) {
    return {
      error: 'Could not extract ASIN from input',
      code: 'INVALID_INPUT'
    };
  }

  // Use Cheerio scraping
  console.log('Scraping Amazon product with ASIN:', asin);
  return await scrapeAmazonProductCheerio(asin);
}

// Rate limiting helper
const requestTimes: Map<string, number[]> = new Map();

export function checkScrapingRateLimit(ip: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!requestTimes.has(ip)) {
    requestTimes.set(ip, []);
  }
  
  const times = requestTimes.get(ip)!;
  
  // Remove old requests outside the window
  const validTimes = times.filter(time => time > windowStart);
  requestTimes.set(ip, validTimes);
  
  // Check if under limit
  if (validTimes.length >= maxRequests) {
    return false;
  }
  
  // Add current request
  validTimes.push(now);
  return true;
}

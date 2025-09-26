// Generic product scraper for various website types
import { extractGenericRating } from './rating-extractor';

export interface GenericProductData {
  url: string;
  domain: string;
  rawContent: string;
  headings: string[];
  paragraphs: string[];
  title?: string;
  description?: string;
  price?: string;
  images?: string[];
  features?: string[];
  category?: string;
  brand?: string;
  availability?: string;
  rating?: string;
  reviewCount?: string;
}

export interface ScrapingError {
  error: string;
  message: string;
}

// Generic product scraper for various website types
export async function scrapeProductPage(url: string): Promise<GenericProductData | ScrapingError> {
  try {
    console.log('Scraping product page:', url);
    
    // Validate URL
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Fetch the page with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 15000); // 15 second timeout for generic sites
    });

    const fetchPromise = fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (!response.ok) {
      return {
        error: 'fetch_failed',
        message: `Failed to fetch page: ${response.status} ${response.statusText}`
      };
    }

    const html = await response.text();
    
    // Extract raw content for AI analysis
    const rawContent = extractRawContent(html);
    const headings = extractHeadings(html);
    const paragraphs = extractParagraphs(html);
    
    // Try to extract structured data (fallback)
    const structuredData = {
      title: extractTitle(html),
      description: extractDescription(html),
      price: extractPrice(html),
      images: extractImages(html, url),
      features: extractFeatures(html),
      category: extractCategory(html),
      brand: extractBrand(html),
      availability: extractAvailability(html),
      rating: extractRating(html),
      reviewCount: extractReviewCount(html)
    };
    
    const productData: GenericProductData = {
      url,
      domain,
      rawContent,
      headings,
      paragraphs,
      ...structuredData
    };

    console.log('Successfully scraped product data:', {
      title: productData.title ? 'Found' : 'Not found',
      description: productData.description ? 'Found' : 'Not found',
      price: productData.price ? 'Found' : 'Not found',
      images: productData.images?.length || 0,
      features: productData.features?.length || 0
    });

    return productData;

  } catch (error) {
    console.error('Product scraping error:', error);
    return {
      error: 'scraping_failed',
      message: error instanceof Error ? error.message : 'Unknown scraping error'
    };
  }
}

// Helper functions to extract raw content for AI analysis
function extractRawContent(html: string): string {
  // Remove script and style tags
  let content = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove HTML tags but keep text content
  content = content.replace(/<[^>]*>/g, ' ');
  
  // Clean up whitespace
  content = content.replace(/\s+/g, ' ').trim();
  
  return content;
}

function extractHeadings(html: string): string[] {
  const headings: string[] = [];
  const headingPattern = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi;
  let match;
  
  while ((match = headingPattern.exec(html)) !== null) {
    const text = match[1].trim();
    if (text && text.length > 3) {
      headings.push(text);
    }
  }
  
  return headings;
}

function extractParagraphs(html: string): string[] {
  const paragraphs: string[] = [];
  const paragraphPattern = /<p[^>]*>([^<]+)<\/p>/gi;
  let match;
  
  while ((match = paragraphPattern.exec(html)) !== null) {
    const text = match[1].trim();
    if (text && text.length > 20) {
      paragraphs.push(text);
    }
  }
  
  return paragraphs;
}

// Helper functions for structured data extraction
function extractTitle(html: string): string | undefined {
  const patterns = [
    /<title>([^<]+)<\/title>/i,
    /<h1[^>]*>([^<]+)<\/h1>/i,
    /<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="title"[^>]*content="([^"]+)"/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

function extractDescription(html: string): string | undefined {
  const patterns = [
    /<meta[^>]*name="description"[^>]*content="([^"]+)"/i,
    /<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i,
    /<meta[^>]*property="product:description"[^>]*content="([^"]+)"/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

function extractPrice(html: string): string | undefined {
  const patterns = [
    /<meta[^>]*property="product:price:amount"[^>]*content="([^"]+)"/i,
    /<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/span>/i,
    /<div[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/div>/i,
    /£(\d+\.?\d*)/i,
    /\$(\d+\.?\d*)/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

function extractImages(html: string, baseUrl: string): string[] {
  const images: string[] = [];
  const imagePattern = /<img[^>]*src="([^"]+)"[^>]*>/gi;
  let match;
  
  while ((match = imagePattern.exec(html)) !== null) {
    let src = match[1];
    
    // Convert relative URLs to absolute
    if (src.startsWith('/')) {
      src = new URL(src, baseUrl).href;
    } else if (src.startsWith('./')) {
      src = new URL(src, baseUrl).href;
    }
    
    // Filter out placeholder images
    if (!src.includes('placeholder') && !src.includes('no-image') && src.length > 10) {
      images.push(src);
    }
  }
  
  return images.slice(0, 10); // Limit to 10 images
}

function extractFeatures(html: string): string[] {
  const features: string[] = [];
  const featurePatterns = [
    /<li[^>]*>([^<]+)<\/li>/gi,
    /<span[^>]*class="[^"]*feature[^"]*"[^>]*>([^<]+)<\/span>/gi,
    /<div[^>]*class="[^"]*feature[^"]*"[^>]*>([^<]+)<\/div>/gi
  ];
  
  for (const pattern of featurePatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const text = match[1].trim();
      if (text && text.length > 10 && !features.includes(text)) {
        features.push(text);
      }
    }
  }
  
  return features.slice(0, 10); // Limit to 10 features
}

function extractCategory(html: string): string | undefined {
  const patterns = [
    /<meta[^>]*property="product:category"[^>]*content="([^"]+)"/i,
    /<span[^>]*class="[^"]*category[^"]*"[^>]*>([^<]+)<\/span>/i,
    /<div[^>]*class="[^"]*category[^"]*"[^>]*>([^<]+)<\/div>/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

function extractBrand(html: string): string | undefined {
  const patterns = [
    /<meta[^>]*property="product:brand"[^>]*content="([^"]+)"/i,
    /<span[^>]*class="[^"]*brand[^"]*"[^>]*>([^<]+)<\/span>/i,
    /<div[^>]*class="[^"]*brand[^"]*"[^>]*>([^<]+)<\/div>/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

function extractAvailability(html: string): string | undefined {
  const patterns = [
    /<meta[^>]*property="product:availability"[^>]*content="([^"]+)"/i,
    /<span[^>]*class="[^"]*availability[^"]*"[^>]*>([^<]+)<\/span>/i,
    /<div[^>]*class="[^"]*availability[^"]*"[^>]*>([^<]+)<\/div>/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

function extractRating(html: string): string | undefined {
  return extractGenericRating(html);
}

function extractReviewCount(html: string): string | undefined {
  const patterns = [
    /<meta[^>]*property="product:review_count"[^>]*content="([^"]+)"/i,
    /<span[^>]*class="[^"]*review[^"]*"[^>]*>([^<]+)<\/span>/i,
    /<div[^>]*class="[^"]*review[^"]*"[^>]*>([^<]+)<\/div>/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

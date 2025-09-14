import type { AmazonProductData } from './amazon-scraper';

export interface GenericProductData {
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
  url: string;
  domain: string;
  // Raw content for AI analysis
  rawContent?: string;
  headings?: string[];
  paragraphs?: string[];
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
  
  // Limit to first 2000 characters to avoid token limits
  return content.substring(0, 2000);
}

function extractHeadings(html: string): string[] {
  const headings: string[] = [];
  const headingPattern = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi;
  let match;
  
  while ((match = headingPattern.exec(html)) !== null) {
    const heading = match[1].trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (heading && heading.length > 3 && heading.length < 100) {
      headings.push(heading);
    }
  }
  
  return headings.slice(0, 10); // Limit to first 10 headings
}

function extractParagraphs(html: string): string[] {
  const paragraphs: string[] = [];
  const paragraphPattern = /<p[^>]*>([^<]+)<\/p>/gi;
  let match;
  
  while ((match = paragraphPattern.exec(html)) !== null) {
    const paragraph = match[1].trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (paragraph && paragraph.length > 20 && paragraph.length < 300) {
      paragraphs.push(paragraph);
    }
  }
  
  return paragraphs.slice(0, 5); // Limit to first 5 paragraphs
}

// Helper functions to extract structured data (fallback)
function extractTitle(html: string): string | undefined {
  // Try various title patterns
  const patterns = [
    /<title[^>]*>([^<]+)<\/title>/i,
    /<h1[^>]*>([^<]+)<\/h1>/i,
    /<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="twitter:title"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="title"[^>]*content="([^"]+)"/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }
  }
  return undefined;
}

function extractDescription(html: string): string | undefined {
  // Try various description patterns
  const patterns = [
    /<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="description"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="twitter:description"[^>]*content="([^"]+)"/i,
    /<p[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)<\/p>/i,
    /<div[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)<\/div>/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }
  }
  return undefined;
}

function extractPrice(html: string): string | undefined {
  // Try various price patterns
  const patterns = [
    /<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/span>/i,
    /<div[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/div>/i,
    /<meta[^>]*property="product:price:amount"[^>]*content="([^"]+)"/i,
    /<meta[^>]*property="og:price:amount"[^>]*content="([^"]+)"/i,
    /£\s*[\d,]+\.?\d*/g,
    /\$\s*[\d,]+\.?\d*/g,
    /€\s*[\d,]+\.?\d*/g
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
  
  // Try various image patterns
  const patterns = [
    /<img[^>]*src="([^"]+)"[^>]*>/gi,
    /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/gi,
    /<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/gi
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let imageUrl = match[1];
      
      // Convert relative URLs to absolute
      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        const urlObj = new URL(baseUrl);
        imageUrl = urlObj.origin + imageUrl;
      }
      
      // Filter out small images and common non-product images
      if (imageUrl && 
          !imageUrl.includes('logo') && 
          !imageUrl.includes('icon') && 
          !imageUrl.includes('avatar') &&
          !imageUrl.includes('favicon') &&
          images.length < 10) {
        images.push(imageUrl);
      }
    }
  }

  return Array.from(new Set(images)); // Remove duplicates
}

function extractFeatures(html: string): string[] {
  const features: string[] = [];
  
  // Try to find feature lists
  const patterns = [
    /<li[^>]*>([^<]+)<\/li>/gi,
    /<ul[^>]*class="[^"]*features[^"]*"[^>]*>(.*?)<\/ul>/i,
    /<div[^>]*class="[^"]*features[^"]*"[^>]*>(.*?)<\/div>/i
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const text = match[1].trim();
      if (text && text.length > 10 && text.length < 200 && features.length < 10) {
        features.push(text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
      }
    }
  }

  return features;
}

function extractCategory(html: string): string | undefined {
  const patterns = [
    /<meta[^>]*property="product:category"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="category"[^>]*content="([^"]+)"/i,
    /<span[^>]*class="[^"]*category[^"]*"[^>]*>([^<]+)<\/span>/i
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
    /<meta[^>]*name="brand"[^>]*content="([^"]+)"/i,
    /<span[^>]*class="[^"]*brand[^"]*"[^>]*>([^<]+)<\/span>/i
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
    /<span[^>]*class="[^"]*availability[^"]*"[^>]*>([^<]+)<\/span>/i,
    /<div[^>]*class="[^"]*stock[^"]*"[^>]*>([^<]+)<\/div>/i,
    /in stock/i,
    /out of stock/i,
    /available/i
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
  const patterns = [
    /<meta[^>]*property="product:rating"[^>]*content="([^"]+)"/i,
    /<span[^>]*class="[^"]*rating[^"]*"[^>]*>([^<]+)<\/span>/i,
    /<div[^>]*class="[^"]*rating[^"]*"[^>]*>([^<]+)<\/div>/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
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

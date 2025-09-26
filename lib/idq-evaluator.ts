// Binary IDQ (Item Data Quality) Evaluator
// Implements 9 reliable binary checks based on Amazon PDP HTML scraping
// Removed unreliable image counting - focusing on quality factors we can accurately measure

import { extractRatingFromHtml } from './rating-extractor';

export interface IdqConfig {
  maxTitleLength?: number;
  minBulletCount?: number;
  minDescriptionChars?: number;
  // Removed minImageCount - no longer used in 9-point system
  keywords?: string[];
  // Removed requiredAttributes - maintaining consistent 9-point system
  gradeBands?: {
    A: [number, number];
    B: [number, number];
    C: [number, number];
  };
}

export interface IdqResult {
  score: number;
  maxPossible: number;
  qualityPercent: number;
  grade: string;
  checks: {
    has_brand: number;
    title_starts_with_brand: number;
    title_correct_length: number;
    has_bullets_5plus: number;
    has_description_200plus: number;
    has_main_image: number;
    brand_in_bullets_or_desc: number;
    has_reviews: number;
    has_star_rating: number;
    relevant_attributes_covered?: number;
  };
  notes: string[];
  // Back-compat fields
  qualityScore?: number;
  qualityGrade?: string;
  hasImage?: boolean;
  hasAplus?: boolean;
  hasPremiumAplus?: boolean;
  bulletPointsCount?: number;
  totalImages?: number;
  isSearchIndexed?: boolean;
  isQuarantined?: boolean;
  isLeafNode?: boolean;
  isWebsiteActive?: boolean;
  hasImageZoom?: boolean;
  hasIai?: boolean;
}

// AI-powered IDQ evaluation function
export async function evaluateIdqWithAI(html: string, config: IdqConfig = {}, extractedData?: any): Promise<IdqResult> {
  try {
    // Use provided extracted data for IDQ analysis
    const dataToAnalyze = extractedData;
    
    if (!dataToAnalyze) {
      console.log('No extracted data provided, falling back to regex extraction');
      return evaluateIdq(html, config);
    } else {
      console.log('Using provided extracted data for IDQ analysis');
    }
    
    // Run binary checks using AI-extracted data
    const cfg: Required<IdqConfig> = {
      maxTitleLength: config.maxTitleLength || 200,
      minBulletCount: config.minBulletCount || 5,
      minDescriptionChars: config.minDescriptionChars || 200,
      // Removed minImageCount - no longer used in 9-point system
      keywords: config.keywords || [],
      // Removed requiredAttributes - maintaining consistent 9-point system
      gradeBands: config.gradeBands || { A: [8, 9], B: [6, 7], C: [0, 5] }
    };

    const notes: string[] = [];
    
    // Inline helper functions
    const normText = (s: string): string => {
      return s.toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[®™]/g, '')
        .replace(/[^\w\s]/g, '');
    };

    const startsWithBrand = (title: string, brand: string): boolean => {
      const normTitle = normText(title);
      const normBrand = normText(brand);
      return normTitle.startsWith(normBrand);
    };

    const includesAny = (haystack: string, needles: string[]): boolean => {
      const normHaystack = normText(haystack);
      return needles.some(needle => normHaystack.includes(normText(needle)));
    };

    // Binary checks using extracted data - only score what we can reliably extract
    // Removed has_keywords, has_aplus, has_premium_aplus, images_6plus as unreliable
    const checks = {
      has_brand: dataToAnalyze.brand ? 1 : 0,
      title_starts_with_brand: (dataToAnalyze.brand && dataToAnalyze.title && startsWithBrand(dataToAnalyze.title, dataToAnalyze.brand)) ? 1 : 0,
      title_correct_length: (dataToAnalyze.title && dataToAnalyze.title.length >= 10 && dataToAnalyze.title.length <= cfg.maxTitleLength) ? 1 : 0,
      has_bullets_5plus: (dataToAnalyze.bullets && Array.isArray(dataToAnalyze.bullets) && dataToAnalyze.bullets.length >= cfg.minBulletCount) ? 1 : 0,
      has_description_200plus: (dataToAnalyze.description && dataToAnalyze.description.length >= cfg.minDescriptionChars) ? 1 : 0,
      has_main_image: (dataToAnalyze.images && Array.isArray(dataToAnalyze.images) && dataToAnalyze.images.length > 0) ? 1 : 0,
      brand_in_bullets_or_desc: (dataToAnalyze.brand && (
        (dataToAnalyze.bullets && Array.isArray(dataToAnalyze.bullets) && dataToAnalyze.bullets.some((bullet: string) => bullet && includesAny(bullet, [dataToAnalyze.brand]))) || 
        (dataToAnalyze.description && typeof dataToAnalyze.description === 'string' && includesAny(dataToAnalyze.description, [dataToAnalyze.brand]))
      )) ? 1 : 0,
      has_reviews: (dataToAnalyze.reviewCount && dataToAnalyze.reviewCount >= 1) ? 1 : 0,
      has_star_rating: (dataToAnalyze.rating !== null && isFinite(dataToAnalyze.rating) && dataToAnalyze.rating > 0) ? 1 : 0
    };

    // Calculate score
    const score = Object.values(checks).reduce((sum, check) => sum + check, 0);
    const maxPossible = 9; // Updated to 9 after removing unreliable image counting
    
    // Adjusted scoring: If product passes most scrapable checks, it's likely 100% IDQ
    // Amazon 100% IDQ products should score 100% in our system too (we can't check everything Amazon checks)
    let qualityPercent;
    if (score >= 8) {
      qualityPercent = 100; // 8-9/9 = 100% (accounts for checks we can't verify that Amazon does)
    } else if (score === 7) {
      qualityPercent = 89; // 7/9 = Good but not perfect
    } else {
      qualityPercent = Math.round((score / maxPossible) * 100); // Standard percentage for lower scores
    }
    
    console.log(`IDQ Scoring: ${score}/${maxPossible} checks passed = ${qualityPercent}%`);

    // Determine grade - adjusted for new 9-point scale
    let grade = 'C';
    if (score >= 8 && score <= 9) grade = 'A'; // 8-9/9 (89-100%)
    else if (score >= 6 && score <= 7) grade = 'B'; // 6-7/9 (67-88%)

    // Debug logging for troubleshooting
    console.log('IDQ AI Method Debug:', {
      method: 'AI',
      extractedData: !!dataToAnalyze,
      checks: {
        brand: checks.has_brand,
        titleStartsBrand: checks.title_starts_with_brand,
        titleLength: checks.title_correct_length,
        bullets: checks.has_bullets_5plus,
        description: checks.has_description_200plus,
        mainImage: checks.has_main_image,
        brandInContent: checks.brand_in_bullets_or_desc,
        reviews: checks.has_reviews,
        rating: checks.has_star_rating
      },
      finalScore: score,
      maxPossible: maxPossible,
      percentage: qualityPercent,
      grade: grade
    });

    // Generate notes - only for checks we can actually measure
    if (!checks.has_brand) notes.push('Missing brand information - customers can\'t identify your product');
    if (!checks.title_starts_with_brand && dataToAnalyze.brand && dataToAnalyze.title) notes.push('Title doesn\'t start with your brand - missed branding opportunity');
    if (!checks.title_correct_length && dataToAnalyze.title) notes.push(`Title is too long (${dataToAnalyze.title.length} characters) - Amazon may cut it off`);
    if (!checks.has_bullets_5plus) notes.push(`Only ${dataToAnalyze.bullets ? dataToAnalyze.bullets.length : 0} bullet points - you\'re missing key selling opportunities`);
    if (!checks.has_description_200plus && dataToAnalyze.description) notes.push('Product description is too short - customers need more details to buy');
    if (!checks.has_main_image) notes.push('Main product image missing - first impression is everything');
    if (!checks.brand_in_bullets_or_desc && dataToAnalyze.brand) notes.push('Brand not mentioned in product details - missed trust-building opportunity');
    if (!checks.has_reviews) notes.push('No customer reviews - social proof is crucial for conversions');
    if (!checks.has_star_rating) notes.push('No star rating visible - customers can\'t see your product quality');

    return {
      score,
      maxPossible,
      qualityPercent,
      grade,
      checks,
      notes,
      // Back-compat mapping
      qualityScore: qualityPercent,
      qualityGrade: grade,
      hasImage: checks.has_main_image === 1,
      hasAplus: false, // Always false - we can't reliably detect A+ content
      hasPremiumAplus: false, // Always false - we can't reliably detect premium A+ content
      bulletPointsCount: dataToAnalyze.bullets ? dataToAnalyze.bullets.length : 0,
      totalImages: dataToAnalyze.images ? dataToAnalyze.images.length : 0,
      isSearchIndexed: false, // Can't access Amazon's internal systems
      isQuarantined: false, // Can't access Amazon's internal systems
      isLeafNode: false, // Can't access Amazon's internal systems
      isWebsiteActive: false, // Can't access Amazon's internal systems
      hasImageZoom: false, // Can't access Amazon's internal systems
      hasIai: false // Can't access Amazon's internal systems
    };

  } catch (error) {
    console.error('AI-powered IDQ evaluation failed, falling back to regex:', error);
    // Fall back to original regex-based evaluation
    return evaluateIdq(html, config);
  }
}

// Main IDQ evaluation function (regex-based fallback)
export function evaluateIdq(html: string, config: IdqConfig = {}): IdqResult {
  // Default configuration
  const cfg: Required<IdqConfig> = {
    maxTitleLength: config.maxTitleLength || 200,
    minBulletCount: config.minBulletCount || 5,
    minDescriptionChars: config.minDescriptionChars || 200,
    // Removed minImageCount - no longer used in 9-point system
    keywords: config.keywords || [],
    // Removed requiredAttributes - maintaining consistent 9-point system
      gradeBands: config.gradeBands || { A: [8, 9], B: [6, 7], C: [0, 5] }
  };

  const notes: string[] = [];
  
  // Inline helper functions
  const normText = (s: string): string => {
    return s.toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[®™]/g, '')
      .replace(/[^\w\s]/g, '');
  };

  const startsWithBrand = (title: string, brand: string): boolean => {
    const normTitle = normText(title);
    const normBrand = normText(brand);
    return normTitle.startsWith(normBrand);
  };

  const includesAny = (haystack: string, needles: string[]): boolean => {
    const normHaystack = normText(haystack);
    return needles.some(needle => normHaystack.includes(normText(needle)));
  };

  // Extract data from HTML using selectors
  const brand = extractBrandFromHtml(html);
  const title = extractTitleFromHtml(html);
  const bullets = extractBulletsFromHtml(html);
  const description = extractDescriptionFromHtml(html);
  const hasAplus = checkAplusFromHtml(html);
  const hasPremiumAplus = checkPremiumAplusFromHtml(html);
  const hasMainImage = checkMainImageFromHtml(html);
  const reviewCount = extractReviewCountFromHtml(html);
  const rating = extractRatingFromHtml(html);

  // Binary checks (1 for pass, 0 for fail) - only checks we can reliably measure
  const checks = {
    has_brand: brand ? 1 : 0,
    title_starts_with_brand: (brand && title && startsWithBrand(title, brand)) ? 1 : 0,
    title_correct_length: (title && title.length >= 10 && title.length <= cfg.maxTitleLength) ? 1 : 0,
    has_bullets_5plus: (bullets.length >= cfg.minBulletCount) ? 1 : 0,
    has_description_200plus: (description && description.length >= cfg.minDescriptionChars) ? 1 : 0,
    has_main_image: hasMainImage ? 1 : 0,
    brand_in_bullets_or_desc: (brand && (bullets.some(bullet => includesAny(bullet, [brand])) || 
      (description && includesAny(description, [brand])))) ? 1 : 0,
    has_reviews: (reviewCount >= 1) ? 1 : 0,
    has_star_rating: (rating !== null && isFinite(rating) && rating > 0) ? 1 : 0
  };

  // Removed optional attribute coverage check - maintaining consistent 9-point system

  // Calculate score
  const score = Object.values(checks).reduce((sum, check) => sum + check, 0);
  const maxPossible = 9; // Fixed to always use 9-point system (removed image counting completely)
  
  // Adjusted scoring: If product passes most scrapable checks, it's likely 100% IDQ
  // Amazon 100% IDQ products should score 100% in our system too (we can't check everything Amazon checks)
  let qualityPercent;
  if (score >= 8) {
    qualityPercent = 100; // 8-9/9 = 100% (accounts for checks we can't verify that Amazon does)
  } else if (score === 7) {
    qualityPercent = 89; // 7/9 = Good but not perfect
  } else {
    qualityPercent = Math.round((score / maxPossible) * 100); // Standard percentage for lower scores
  }
  
  console.log(`IDQ Scoring (Regex): ${score}/${maxPossible} checks passed = ${qualityPercent}%`);

  // Determine grade - adjusted for new 9-point scale
  let grade = 'C';
  if (score >= 8 && score <= 9) grade = 'A'; // 8-9/9 (89-100%)
  else if (score >= 6 && score <= 7) grade = 'B'; // 6-7/9 (67-88%)

  // Debug logging for troubleshooting
  console.log('IDQ Regex Method Debug:', {
    method: 'Regex',
    extractedData: {
      brand: brand ? brand.substring(0, 20) : 'None',
      titleLength: title ? title.length : 0,
      bulletsCount: bullets.length,
      descriptionLength: description ? description.length : 0,
      reviewCount: reviewCount,
      rating: rating
    },
    checks: {
      brand: checks.has_brand,
      titleStartsBrand: checks.title_starts_with_brand,
      titleLength: checks.title_correct_length,
      bullets: checks.has_bullets_5plus,
      description: checks.has_description_200plus,
      mainImage: checks.has_main_image,
      brandInContent: checks.brand_in_bullets_or_desc,
      reviews: checks.has_reviews,
      rating: checks.has_star_rating
    },
    finalScore: score,
    maxPossible: maxPossible,
    percentage: qualityPercent,
    grade: grade
  });

  // Generate human-friendly notes for failed checks - only for checks we can actually measure
  if (!checks.has_brand) notes.push('Missing brand information - customers can\'t identify your product');
  if (!checks.title_starts_with_brand && brand && title) notes.push('Title doesn\'t start with your brand - missed branding opportunity');
  if (!checks.title_correct_length && title) {
    if (title.length < 10) {
      notes.push(`Title is too short (${title.length} characters) - needs at least 10 characters`);
    } else {
      notes.push(`Title is too long (${title.length} characters) - Amazon may cut it off`);
    }
  }
  if (!checks.has_bullets_5plus) notes.push(`Only ${bullets.length} bullet points - you\'re missing key selling opportunities`);
  if (!checks.has_description_200plus && description) notes.push('Product description is too short - customers need more details to buy');
  if (!checks.has_main_image) notes.push('Main product image missing - first impression is everything');
  if (!checks.brand_in_bullets_or_desc && brand) notes.push('Brand not mentioned in product details - missed trust-building opportunity');
  if (!checks.has_reviews) notes.push('No customer reviews - social proof is crucial for conversions');
  if (!checks.has_star_rating) notes.push('No star rating visible - customers can\'t see your product quality');
  // Removed attribute coverage notes - maintaining consistent 9-point system

  return {
    score,
    maxPossible,
    qualityPercent,
    grade,
    checks,
    notes,
    // Back-compat mapping
    qualityScore: qualityPercent,
    qualityGrade: grade,
    hasImage: checks.has_main_image === 1,
    hasAplus: false, // Always false - we can't reliably detect A+ content
    hasPremiumAplus: false, // Always false - we can't reliably detect premium A+ content
    bulletPointsCount: bullets.length,
    totalImages: 0, // Image counting removed as unreliable,
    isSearchIndexed: false, // Can't access Amazon's internal systems
    isQuarantined: false, // Can't access Amazon's internal systems
    isLeafNode: false, // Can't access Amazon's internal systems
    isWebsiteActive: false, // Can't access Amazon's internal systems
    hasImageZoom: false, // Can't access Amazon's internal systems
    hasIai: false // Can't access Amazon's internal systems
  };
}

// HTML extraction helper functions
function extractBrandFromHtml(html: string): string | null {
  // Comprehensive brand extraction patterns
  const patterns = [
    // Primary patterns - most common
    /<span[^>]*id="bylineInfo"[^>]*>([^<]+)<\/span>/,
    /<a[^>]*id="bylineInfo"[^>]*>([^<]+)<\/a>/,
    /<span[^>]*id="brand"[^>]*>([^<]+)<\/span>/,
    
    // Alternative patterns for different layouts
    /<a[^>]*href="[^"]*\/brand\/[^"]*"[^>]*>([^<]+)<\/a>/,
    /<span[^>]*class="[^"]*brand[^"]*"[^>]*>([^<]+)<\/span>/,
    /by\s+<a[^>]*href="[^"]*\/stores\/[^"]*"[^>]*>([^<]+)<\/a>/i,
    /brand[^>]*:\s*<[^>]*>([^<]+)<\//i,
    
    // Fallback patterns
    /<td[^>]*class="[^"]*label[^"]*"[^>]*>\s*Brand[^<]*<\/td>\s*<td[^>]*>([^<]+)<\/td>/i,
    /<th[^>]*>\s*Brand[^<]*<\/th>\s*<td[^>]*>([^<]+)<\/td>/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const brand = match[1].trim();
      // Filter out common false positives
      if (brand.length > 1 && 
          !brand.includes('Visit the') && 
          !brand.includes('Brand:') &&
          !brand.includes('by ') &&
          brand.length < 50) {
        return brand;
      }
    }
  }
  return null;
}

function extractTitleFromHtml(html: string): string | null {
  // Multiple patterns for title extraction
  const patterns = [
    // Primary pattern
    /<span[^>]*id="productTitle"[^>]*>([^<]+)<\/span>/,
    
    // Alternative patterns
    /<h1[^>]*id="title"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>[\s\S]*?<\/h1>/,
    /<h1[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/h1>/,
    /<title>([^<]*Amazon[^<]*)<\/title>/, // Extract from page title as fallback
    
    // Fallback patterns
    /<div[^>]*id="title"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/,
    /<span[^>]*class="[^"]*product-title[^"]*"[^>]*>([^<]+)<\/span>/
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      let title = match[1].trim();
      
      // Clean up title if it's from page title
      if (pattern === patterns[3]) {
        title = title.replace(/Amazon\.com\s*:\s*/i, '')
                     .replace(/\s*-\s*Amazon\.com$/i, '')
                     .replace(/\s*\|\s*Amazon\.com$/i, '');
      }
      
      // Validate title
      if (title.length > 5 && title.length < 500) {
        return title;
      }
    }
  }
  return null;
}

function extractBulletsFromHtml(html: string): string[] {
  const bullets: string[] = [];
  
  // Enhanced patterns for bullet extraction
  const patterns = [
    // Primary patterns - focus on product feature sections
    /<div[^>]*id="feature-bullets"[^>]*>[\s\S]*?<\/div>/,
    /<div[^>]*class="[^"]*feature[^"]*"[^>]*>[\s\S]*?<\/div>/,
    /<ul[^>]*class="[^"]*a-unordered-list[^"]*"[^>]*>[\s\S]*?<\/ul>/
  ];
  
  // Try to find product-specific bullet sections first
  let bulletSection = '';
  for (const pattern of patterns) {
    const sectionMatch = html.match(pattern);
    if (sectionMatch) {
      bulletSection = sectionMatch[0];
      break;
    }
  }
  
  // If no specific section found, use entire HTML but be more selective
  if (!bulletSection) {
    bulletSection = html;
  }
  
  // Extract bullets from the identified section
  const bulletPatterns = [
    /<li[^>]*class="[^"]*a-list-item[^"]*"[^>]*><span[^>]*class="[^"]*a-list-item[^"]*"[^>]*>([^<]+)<\/span><\/li>/g,
    /<li[^>]*class="[^"]*a-list-item[^"]*"[^>]*>([^<]+)<\/li>/g,
    /<li[^>]*>[\s]*<span[^>]*>([^<]+)<\/span>[\s]*<\/li>/g,
    /<li[^>]*>\s*([^<]+)\s*<\/li>/g
  ];
  
  for (const pattern of bulletPatterns) {
    let match;
    while ((match = pattern.exec(bulletSection)) !== null) {
      const text = match[1].trim();
      
      // Enhanced filtering for quality bullets
      if (text && 
          text.length > 15 && 
          text.length < 200 &&
          !text.includes('Make sure this fits') &&
          !text.includes('Enter your model number') &&
          !text.includes('Customers say') &&
          !text.includes('Reviews with images') &&
          !text.includes('Top reviews') &&
          !text.includes('Style:') &&
          !text.includes('Color:') &&
          !text.includes('Size:') &&
          !text.includes('›') &&
          !bullets.includes(text)) {
        bullets.push(text);
      }
    }
    
    // If we found quality bullets, stop searching
    if (bullets.length >= 5) {
      break;
    }
  }
  
  // Sort by length (longer bullets are typically more informative)
  return bullets.sort((a, b) => b.length - a.length).slice(0, 10);
}

function extractDescriptionFromHtml(html: string): string | null {
  // Enhanced patterns for description extraction
  const patterns = [
    // Primary patterns
    /<div[^>]*id="productDescription"[^>]*>([\s\S]*?)<\/div>/,
    /<div[^>]*data-feature-name="productDescription"[^>]*>([\s\S]*?)<\/div>/,
    
    // Alternative patterns
    /<div[^>]*class="[^"]*product-description[^"]*"[^>]*>([\s\S]*?)<\/div>/,
    /<div[^>]*id="aplus"[^>]*>([\s\S]*?)<\/div>/,
    /<div[^>]*class="[^"]*aplus-v2[^"]*"[^>]*>([\s\S]*?)<\/div>/,
    
    // Fallback patterns - look for any substantial text content
    /<div[^>]*data-cel-widget="[^"]*productDescription[^"]*"[^>]*>([\s\S]*?)<\/div>/,
    /<section[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/section>/
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      // Strip HTML tags and get plain text
      const text = match[1]
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
        .replace(/<[^>]*>/g, ' ') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
        .replace(/&[a-zA-Z0-9#]+;/g, ' ') // Replace HTML entities
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      // Filter out short or irrelevant content
      if (text.length > 100 && 
          !text.includes('JavaScript is disabled') &&
          !text.includes('Enable JavaScript') &&
          !text.includes('Please enable cookies')) {
        return text;
      }
    }
  }
  return null;
}

function checkAplusFromHtml(html: string): boolean {
  const patterns = [
    /<div[^>]*id="aplus"[^>]*>/,
    /<div[^>]*class="[^"]*aplus-v2[^"]*"[^>]*>/,
    /<div[^>]*data-cel-widget="[^"]*aplus[^"]*"[^>]*>/
  ];
  
  return patterns.some(pattern => pattern.test(html));
}

function checkPremiumAplusFromHtml(html: string): boolean {
  const patterns = [
    /<div[^>]*class="[^"]*aplus-3p-premium[^"]*"[^>]*>/,
    /<div[^>]*class="[^"]*aplus-premium[^"]*"[^>]*>/,
    /<div[^>]*data-aplus-premium="true"[^>]*>/
  ];
  
  return patterns.some(pattern => pattern.test(html));
}

function checkMainImageFromHtml(html: string): boolean {
  const patterns = [
    /<div[^>]*id="imgTagWrapperId"[^>]*>[\s\S]*?<img/,
    /<img[^>]*id="landingImage"[^>]*>/,
    /<img[^>]*data-old-hires[^>]*>/
  ];
  
  return patterns.some(pattern => pattern.test(html));
}


function extractReviewCountFromHtml(html: string): number {
  const patterns = [
    /<span[^>]*id="acrCustomerReviewText"[^>]*>([^<]+)<\/span>/,
    /<span[^>]*id="averageCustomerReviews"[^>]*>([^<]+)<\/span>/
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const text = match[1];
      const numMatch = text.match(/([\d,]+)/);
      if (numMatch) {
        return parseInt(numMatch[1].replace(/,/g, ''));
      }
    }
  }
  return 0;
}

function extractAttributeLabelsFromHtml(html: string): string[] {
  const labels: string[] = [];
  const patterns = [
    /<th[^>]*>([^<]+)<\/th>/g,
    /<td[^>]*class="[^"]*label[^"]*"[^>]*>([^<]+)<\/td>/g,
    /<span[^>]*class="[^"]*label[^"]*"[^>]*>([^<]+)<\/span>/g
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const label = match[1].trim();
      if (label && label.length > 2 && label.length < 50) {
        labels.push(label);
      }
    }
  });
  
  return labels;
}
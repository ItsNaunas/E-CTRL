// Binary IDQ (Item Data Quality) Evaluator v2
// Implements 8 binary checks based on Amazon PDP HTML scraping
// Removed reviews and star rating checks to match actual IDQ score
// Removed AI scraper import - using regex extraction data directly

export interface IdqConfig {
  maxTitleLength?: number;
  minBulletCount?: number;
  minDescriptionChars?: number;
  minImageCount?: number;
  keywords?: string[];
  requiredAttributes?: string[];
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
    images_6plus: number;
    brand_in_bullets_or_desc: number;
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
      minImageCount: config.minImageCount || 6,
      keywords: config.keywords || [],
      requiredAttributes: config.requiredAttributes || [],
      gradeBands: config.gradeBands || { A: [7, 8], B: [5, 6], C: [0, 4] }
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
    // Removed has_reviews and has_star_rating to match actual IDQ score
    const checks = {
      has_brand: dataToAnalyze.brand ? 1 : 0,
      title_starts_with_brand: (dataToAnalyze.brand && dataToAnalyze.title && startsWithBrand(dataToAnalyze.title, dataToAnalyze.brand)) ? 1 : 0,
      title_correct_length: (dataToAnalyze.title && dataToAnalyze.title.length >= 10 && dataToAnalyze.title.length <= cfg.maxTitleLength) ? 1 : 0,
      has_bullets_5plus: (dataToAnalyze.bullets && dataToAnalyze.bullets.length >= cfg.minBulletCount) ? 1 : 0,
      has_description_200plus: (dataToAnalyze.description && dataToAnalyze.description.length >= cfg.minDescriptionChars) ? 1 : 0,
      has_main_image: (dataToAnalyze.images && dataToAnalyze.images.length > 0) ? 1 : 0,
      images_6plus: (dataToAnalyze.images && dataToAnalyze.images.length >= cfg.minImageCount) ? 1 : 0,
      brand_in_bullets_or_desc: (dataToAnalyze.brand && (dataToAnalyze.bullets && dataToAnalyze.bullets.some((bullet: string) => includesAny(bullet, [dataToAnalyze.brand])) || 
        (dataToAnalyze.description && includesAny(dataToAnalyze.description, [dataToAnalyze.brand])))) ? 1 : 0
    };

    // Calculate score
    const score = Object.values(checks).reduce((sum, check) => sum + check, 0);
    const maxPossible = 8; // Updated from 10 to 8 after removing reviews and star rating
    const qualityPercent = Math.round((score / maxPossible) * 100);

    // Determine grade - adjusted for new 8-point scale
    let grade = 'C';
    if (score >= 7 && score <= 8) grade = 'A'; // 7-8/8 (87.5-100%)
    else if (score >= 5 && score <= 6) grade = 'B'; // 5-6/8 (62.5-75%)

    // Generate notes - only for checks we can actually measure
    if (!checks.has_brand) notes.push('Missing brand information - customers can\'t identify your product');
    if (!checks.title_starts_with_brand && dataToAnalyze.brand && dataToAnalyze.title) notes.push('Title doesn\'t start with your brand - missed branding opportunity');
    if (!checks.title_correct_length && dataToAnalyze.title) notes.push(`Title is too long (${dataToAnalyze.title.length} characters) - Amazon may cut it off`);
    if (!checks.has_bullets_5plus) notes.push(`Only ${dataToAnalyze.bullets ? dataToAnalyze.bullets.length : 0} bullet points - you\'re missing key selling opportunities`);
    if (!checks.has_description_200plus && dataToAnalyze.description) notes.push('Product description is too short - customers need more details to buy');
    if (!checks.has_main_image) notes.push('Main product image missing - first impression is everything');
    if (!checks.images_6plus) notes.push(`Only ${dataToAnalyze.images ? dataToAnalyze.images.length : 0} images - customers need to see more to feel confident buying`);
    if (!checks.brand_in_bullets_or_desc && dataToAnalyze.brand) notes.push('Brand not mentioned in product details - missed trust-building opportunity');

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
    minImageCount: config.minImageCount || 6,
    keywords: config.keywords || [],
    requiredAttributes: config.requiredAttributes || [],
    gradeBands: config.gradeBands || { A: [7, 8], B: [5, 6], C: [0, 4] }
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
  const imageCount = countImagesFromHtml(html);

  // Binary checks (1 for pass, 0 for fail) - only checks we can reliably measure
  // Removed has_reviews and has_star_rating to match actual IDQ score
  const checks = {
    has_brand: brand ? 1 : 0,
    title_starts_with_brand: (brand && title && startsWithBrand(title, brand)) ? 1 : 0,
    title_correct_length: (title && title.length <= cfg.maxTitleLength) ? 1 : 0,
    has_bullets_5plus: (bullets.length >= cfg.minBulletCount) ? 1 : 0,
    has_description_200plus: (description && description.length >= cfg.minDescriptionChars) ? 1 : 0,
    has_main_image: hasMainImage ? 1 : 0,
    images_6plus: (imageCount >= cfg.minImageCount) ? 1 : 0,
    brand_in_bullets_or_desc: (brand && (bullets.some(bullet => includesAny(bullet, [brand])) || 
      (description && includesAny(description, [brand])))) ? 1 : 0
  };

  // Optional attribute coverage check
  if (cfg.requiredAttributes.length > 0) {
    const attributeLabels = extractAttributeLabelsFromHtml(html);
    const minRequired = Math.min(cfg.requiredAttributes.length, 3);
    const foundAttributes = cfg.requiredAttributes.filter(attr => 
      attributeLabels.some(label => normText(label).includes(normText(attr)))
    );
    (checks as any).relevant_attributes_covered = (foundAttributes.length >= minRequired) ? 1 : 0;
  }

  // Calculate score
  const score = Object.values(checks).reduce((sum, check) => sum + check, 0);
  const maxPossible = cfg.requiredAttributes.length > 0 ? 9 : 8; // Updated from 11:10 to 9:8
  const qualityPercent = Math.round((score / maxPossible) * 100);

  // Determine grade - adjusted for new 8-point scale
  let grade = 'C';
  if (score >= 7 && score <= 8) grade = 'A'; // 7-8/8 (87.5-100%)
  else if (score >= 5 && score <= 6) grade = 'B'; // 5-6/8 (62.5-75%)

  // Generate human-friendly notes for failed checks - only for checks we can actually measure
  if (!checks.has_brand) notes.push('Missing brand information - customers can\'t identify your product');
  if (!checks.title_starts_with_brand && brand && title) notes.push('Title doesn\'t start with your brand - missed branding opportunity');
  if (!checks.title_correct_length && title) notes.push(`Title is too long (${title.length} characters) - Amazon may cut it off`);
  if (!checks.has_bullets_5plus) notes.push(`Only ${bullets.length} bullet points - you\'re missing key selling opportunities`);
  if (!checks.has_description_200plus && description) notes.push('Product description is too short - customers need more details to buy');
  if (!checks.has_main_image) notes.push('Main product image missing - first impression is everything');
  if (!checks.images_6plus) notes.push(`Only ${imageCount} images - customers need to see more to feel confident buying`);
  if (!checks.brand_in_bullets_or_desc && brand) notes.push('Brand not mentioned in product details - missed trust-building opportunity');
  if ((checks as any).relevant_attributes_covered === 0 && cfg.requiredAttributes.length > 0) {
    notes.push('Missing important product details - customers need complete information');
  }

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
    totalImages: imageCount,
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
  const patterns = [
    /<span[^>]*id="bylineInfo"[^>]*>([^<]+)<\/span>/,
    /<a[^>]*id="bylineInfo"[^>]*>([^<]+)<\/a>/,
    /<span[^>]*id="brand"[^>]*>([^<]+)<\/span>/
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1].trim()) {
      return match[1].trim();
    }
  }
  return null;
}

function extractTitleFromHtml(html: string): string | null {
  const match = html.match(/<span[^>]*id="productTitle"[^>]*>([^<]+)<\/span>/);
  return match ? match[1].trim() : null;
}

function extractBulletsFromHtml(html: string): string[] {
  const bullets: string[] = [];
  const pattern = /<li[^>]*class="[^"]*a-list-item[^"]*"[^>]*>([^<]+)<\/li>/g;
  let match;
  
  while ((match = pattern.exec(html)) !== null) {
    const text = match[1].trim();
    if (text && text.length > 10) {
      bullets.push(text);
    }
  }
  return bullets;
}

function extractDescriptionFromHtml(html: string): string | null {
  const patterns = [
    /<div[^>]*id="productDescription"[^>]*>([\s\S]*?)<\/div>/,
    /<div[^>]*data-feature-name="productDescription"[^>]*>([\s\S]*?)<\/div>/
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      // Strip HTML tags and get plain text
      const text = match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (text.length > 50) {
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

function countImagesFromHtml(html: string): number {
  const patterns = [
    /<li[^>]*class="[^"]*imageThumbnail[^"]*"[^>]*>/g,
    /<li[^>]*data-csa-c-type="image-block"[^>]*>/g,
    /<div[^>]*id="altImages"[^>]*>[\s\S]*?<li/g
  ];
  
  let count = 0;
  patterns.forEach(pattern => {
    const matches = html.match(pattern);
    if (matches) count += matches.length;
  });
  
  return count;
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

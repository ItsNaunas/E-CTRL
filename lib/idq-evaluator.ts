// Binary IDQ (Item Data Quality) Evaluator
// Implements 13 binary checks based on Amazon PDP HTML scraping

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
    has_aplus: number;
    has_premium_aplus: number;
    has_main_image: number;
    images_6plus: number;
    has_keywords: number;
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

// Main IDQ evaluation function
export function evaluateIdq(html: string, config: IdqConfig = {}): IdqResult {
  // Default configuration
  const cfg: Required<IdqConfig> = {
    maxTitleLength: config.maxTitleLength || 200,
    minBulletCount: config.minBulletCount || 5,
    minDescriptionChars: config.minDescriptionChars || 200,
    minImageCount: config.minImageCount || 6,
    keywords: config.keywords || [],
    requiredAttributes: config.requiredAttributes || [],
    gradeBands: config.gradeBands || { A: [11, 13], B: [8, 10], C: [0, 7] }
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
  const reviewCount = extractReviewCountFromHtml(html);
  const rating = extractRatingFromHtml(html);

  // Binary checks (1 for pass, 0 for fail)
  const checks = {
    has_brand: brand ? 1 : 0,
    title_starts_with_brand: (brand && title && startsWithBrand(title, brand)) ? 1 : 0,
    title_correct_length: (title && title.length <= cfg.maxTitleLength) ? 1 : 0,
    has_bullets_5plus: (bullets.length >= cfg.minBulletCount) ? 1 : 0,
    has_description_200plus: (description && description.length >= cfg.minDescriptionChars) ? 1 : 0,
    has_aplus: hasAplus ? 1 : 0,
    has_premium_aplus: hasPremiumAplus ? 1 : 0,
    has_main_image: hasMainImage ? 1 : 0,
    images_6plus: (imageCount >= cfg.minImageCount) ? 1 : 0,
    has_keywords: (cfg.keywords.length > 0 && title && bullets.length > 0 && 
      (includesAny(title, cfg.keywords) || bullets.some(bullet => includesAny(bullet, cfg.keywords)))) ? 1 : 0,
    brand_in_bullets_or_desc: (brand && (bullets.some(bullet => includesAny(bullet, [brand])) || 
      (description && includesAny(description, [brand])))) ? 1 : 0,
    has_reviews: (reviewCount >= 1) ? 1 : 0,
    has_star_rating: (rating !== null && isFinite(rating)) ? 1 : 0
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
  const maxPossible = cfg.requiredAttributes.length > 0 ? 14 : 13;
  const qualityPercent = Math.round((score / maxPossible) * 100);

  // Determine grade
  let grade = 'C';
  if (score >= cfg.gradeBands.A[0] && score <= cfg.gradeBands.A[1]) grade = 'A';
  else if (score >= cfg.gradeBands.B[0] && score <= cfg.gradeBands.B[1]) grade = 'B';

  // Generate notes for failed checks
  if (!checks.has_brand) notes.push('No brand found');
  if (!checks.title_starts_with_brand && brand && title) notes.push('Title does not start with brand');
  if (!checks.title_correct_length && title) notes.push(`Title length ${title.length} > ${cfg.maxTitleLength}`);
  if (!checks.has_bullets_5plus) notes.push(`Only ${bullets.length} bullets; need ≥${cfg.minBulletCount}`);
  if (!checks.has_description_200plus && description) notes.push(`Description ${description.length} chars; need ≥${cfg.minDescriptionChars}`);
  if (!checks.has_aplus) notes.push('No A+ section found');
  if (!checks.has_premium_aplus) notes.push('No premium A+ section found');
  if (!checks.has_main_image) notes.push('No main image found');
  if (!checks.images_6plus) notes.push(`Images ${imageCount}; need ≥${cfg.minImageCount}`);
  if (!checks.has_keywords && cfg.keywords.length > 0) notes.push('Keywords missing in title/bullets');
  if (!checks.brand_in_bullets_or_desc && brand) notes.push('Brand not found in bullets or description');
  if (!checks.has_reviews) notes.push('No reviews found');
  if (!checks.has_star_rating) notes.push('No rating element found');
  if (checks.relevant_attributes_covered === 0 && cfg.requiredAttributes.length > 0) {
    notes.push('Insufficient attribute coverage');
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
    hasAplus: checks.has_aplus === 1,
    hasPremiumAplus: checks.has_premium_aplus === 1,
    bulletPointsCount: bullets.length,
    totalImages: imageCount,
    isSearchIndexed: false, // not scrapable
    isQuarantined: false, // not scrapable
    isLeafNode: false, // not scrapable
    isWebsiteActive: false, // not scrapable
    hasImageZoom: false, // not scrapable
    hasIai: false // not scrapable
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

function extractRatingFromHtml(html: string): number | null {
  const match = html.match(/<span[^>]*id="acrPopover"[^>]*>[\s\S]*?aria-label="([^"]+)"/);
  if (match && match[1]) {
    const ratingText = match[1];
    const ratingMatch = ratingText.match(/([\d.]+)\s+out of/);
    if (ratingMatch) {
      return parseFloat(ratingMatch[1]);
    }
  }
  return null;
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

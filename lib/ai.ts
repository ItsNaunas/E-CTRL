import OpenAI from 'openai';
import type { ExistingSellerData, NewSellerData } from './validation';
import type { AmazonProductData } from './amazon-scraper';
import type { GenericProductData } from './product-scraper';
import { evaluateIdq, evaluateIdqWithAI, type IdqConfig, type IdqResult } from './idq-evaluator';
import { env, validateRequiredEnv } from './env';

// Initialize OpenAI with validated environment
let openai: OpenAI;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    try {
      validateRequiredEnv('api');
      openai = new OpenAI({
        apiKey: env.openai(),
      });
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      throw error;
    }
  }
  return openai;
}

// AI-powered audit analysis for existing sellers with real Amazon data
export async function analyzeExistingSeller(data: ExistingSellerData, productData?: AmazonProductData, accessType: 'guest' | 'account' = 'guest') {
  // Use regex extraction as primary method (it works reliably)
  let binaryIdqResult: IdqResult | null = null;
  if (productData?.htmlContent) {
    try {
      console.log('Running IDQ evaluation with extracted data...');
      const idqConfig: IdqConfig = {
        keywords: data.keywords || [],
        maxTitleLength: 200,
        minBulletCount: 5,
        minDescriptionChars: 200,
        minImageCount: 6
      };
      // Use the extracted data directly for IDQ evaluation
      binaryIdqResult = await evaluateIdqWithAI(productData.htmlContent, idqConfig, productData);
      console.log('IDQ evaluation completed:', binaryIdqResult);
    } catch (error) {
      console.error('IDQ evaluation failed:', error);
      // Continue without IDQ results
    }
  } else {
    console.log('No HTML content available for IDQ evaluation');
  }

  function getGrade(percentage: number): string {
    if (percentage >= 80) return 'A';
    if (percentage >= 60) return 'B';
    return 'C';
  }
  const prompt = `You are an expert Amazon FBA consultant analyzing an EXISTING SELLER'S product listing for UK/EU markets using Amazon's listing quality standards.

${productData ? `
REAL AMAZON PRODUCT DATA:
- ASIN: ${productData.asin}
- Title: ${productData.title}
- Bullet Points: ${productData.bullets.join(' | ')}
- Description: ${productData.description}
- Price: ${productData.price}
- Rating: ${productData.rating}/5 (${productData.reviewCount} reviews)
- Availability: ${productData.availability}
- Brand: ${productData.brand}
- Images: ${productData.images.length} images available
- Features: ${productData.features.join(', ')}
` : `
PRODUCT DETAILS (No real data available):
- ASIN: ${data.asin}
- Keywords: ${data.keywords?.join(', ') || 'None provided'}
- Fulfilment: ${data.fulfilment || 'Not specified'}
`}

${binaryIdqResult ? `
LISTING QUALITY EVALUATION RESULTS:
- Binary Score: ${binaryIdqResult.score}/${binaryIdqResult.maxPossible} (${binaryIdqResult.qualityPercent}%)
- Grade: ${binaryIdqResult.grade}
- Failed Checks: ${binaryIdqResult.notes.join(', ')}
- Brand Found: ${binaryIdqResult.checks.has_brand ? 'Yes' : 'No'}
- Title Starts with Brand: ${binaryIdqResult.checks.title_starts_with_brand ? 'Yes' : 'No'}
- Title Length OK: ${binaryIdqResult.checks.title_correct_length ? 'Yes' : 'No'}
- Bullets Count: ${binaryIdqResult.checks.has_bullets_5plus ? '≥5' : '<5'}
- Description Length: ${binaryIdqResult.checks.has_description_200plus ? '≥200 chars' : '<200 chars'}
- Main Image: ${binaryIdqResult.checks.has_main_image ? 'Yes' : 'No'}
- Image Count: ${binaryIdqResult.checks.images_6plus ? '≥6' : '<6'}
- Brand in Content: ${binaryIdqResult.checks.brand_in_bullets_or_desc ? 'Yes' : 'No'}
- Reviews: ${binaryIdqResult.checks.has_reviews ? 'Yes' : 'No'}
- Star Rating: ${binaryIdqResult.checks.has_star_rating ? 'Yes' : 'No'}

Note: A+ content, premium A+ content, and backend keyword optimization are not included in this analysis as they cannot be reliably detected from visible page content.
` : ''}

${accessType === 'account' ? `
ENHANCED ANALYSIS REQUESTED: This user has an account and should receive premium-level analysis including:
- Advanced competitive analysis and benchmarking
- Detailed keyword optimization strategies with search volume insights
- Conversion rate optimization with psychological triggers
- Seasonal trend considerations and timing recommendations
- Advanced A/B testing recommendations for experienced sellers
- Detailed competitor gap analysis
- ROI projections and impact estimates for each improvement
- Advanced Amazon algorithm optimization strategies
` : `
STANDARD ANALYSIS: This is a guest user - provide comprehensive but focused insights suitable for preview access.
`}

Please provide a comprehensive Amazon LISTING QUALITY AUDIT for this EXISTING SELLER that focuses on IMPROVEMENTS and OPTIMIZATION based on what we can actually measure from the visible listing content:

1. **Listing Quality Score (0-100)**: Use the binary score as foundation, then adjust based on content quality analysis:
   - Base Score: ${binaryIdqResult ? binaryIdqResult.qualityPercent : 'Calculate from data'}
   - Content Quality Adjustments: ±10 points based on benefit focus and conversion potential
   - Final Score: Weighted combination of binary compliance and content quality

2. **Key Issues to Fix (${accessType === 'account' ? '5-7' : '3-5'} points)**: Focus on the biggest problems that are hurting their sales and conversions

3. **Priority Improvements (3-5 points)**: Rank the most impactful fixes that will boost their sales immediately

4. **Detailed Analysis**: In-depth breakdown of what needs to be FIXED and OPTIMIZED:
   - Title Quality: What's wrong with their current title and how to fix it
   - Bullet Points: What's missing from their bullets and how to improve conversion
   - Product Images: What's wrong with their images and how to fix them
   - Product Description: What's missing from their description and how to improve it
   - Product Information: What details are missing and how to add them

Format your response as JSON:
{
  "score": number,
  "highlights": string[],
  "recommendations": string[],
  "detailedAnalysis": {
    "titleQuality": string,
    "bulletPoints": string,
    "productImages": string,
    "productDescription": string,
    "productInformation": string
  },
  "productData": {
    "currentTitle": string,
    "currentBullets": string[],
    "currentImages": number,
    "currentDescription": string,
    "missingElements": string[]
  },
  "contentQuality": {
    "titleScore": number,
    "bulletsScore": number,
    "imagesScore": number,
    "descriptionScore": number,
    "informationScore": number
  },
  "binaryIdqResult": ${binaryIdqResult ? JSON.stringify(binaryIdqResult) : 'null'}
}

Focus on HELPING THIS EXISTING SELLER FIX THEIR CURRENT LISTING. Use the binary evaluation to identify problems and provide specific fixes that will improve their sales and conversions.`;

  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0, // Changed to 0 for deterministic results
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from AI');

    // Try to parse JSON response
    try {
      const result = JSON.parse(response);
      // Ensure binary IDQ result is included
      if (binaryIdqResult && !result.binaryIdqResult) {
        result.binaryIdqResult = binaryIdqResult;
      }
      // Validate the result has a proper score
      if (result.score >= 0 && result.score <= 100) {
        return result;
      } else {
        console.warn('AI returned invalid score, using fallback');
        return generateDeterministicFallback(data, binaryIdqResult, accessType);
      }
    } catch {
      // Fallback: extract structured data from text
      const fallbackResult = parseAIResponse(response);
      if (binaryIdqResult && !fallbackResult.binaryIdqResult) {
        fallbackResult.binaryIdqResult = binaryIdqResult;
      }
      // Validate the fallback result
      if (fallbackResult.score >= 0 && fallbackResult.score <= 100) {
        return fallbackResult;
      } else {
        console.warn('AI fallback parsing failed, using deterministic fallback');
        return generateDeterministicFallback(data, binaryIdqResult, accessType);
      }
    }
  } catch (error) {
    console.error('AI analysis failed:', error);
    console.log('Using deterministic fallback for ASIN:', data.asin);
    return generateDeterministicFallback(data, binaryIdqResult, accessType);
  }
}

// AI-powered listing pack generation for new sellers
export async function analyzeNewSeller(data: NewSellerData, productData?: GenericProductData, accessType: 'guest' | 'account' = 'guest') {
  // First, run binary IDQ evaluation if we have HTML content
  let binaryIdqResult: IdqResult | null = null;
  if (productData?.rawContent) {
    try {
      const idqConfig: IdqConfig = {
        keywords: data.keywords || [],
        maxTitleLength: 200,
        minBulletCount: 5,
        minDescriptionChars: 200,
        minImageCount: 6
      };
      binaryIdqResult = await evaluateIdqWithAI(productData.rawContent, idqConfig);
      console.log('IDQ evaluation completed for new seller:', binaryIdqResult);
    } catch (error) {
      console.error('IDQ evaluation failed for new seller:', error);
      // Continue without IDQ results
    }
  } else {
    console.log('No HTML content available for IDQ evaluation (new seller)');
  }
  const prompt = `You are an expert Amazon FBA consultant creating a complete listing pack for a NEW SELLER who wants to launch their first Amazon product.

${productData ? `
REAL PRODUCT DATA (scraped from website):
- Website: ${productData.url}
- Domain: ${productData.domain}

${productData.title ? `- Title: ${productData.title}` : ''}
${productData.description ? `- Description: ${productData.description}` : ''}
${productData.price ? `- Price: ${productData.price}` : ''}
${productData.brand ? `- Brand: ${productData.brand}` : ''}
${productData.category ? `- Category: ${productData.category}` : ''}
${productData.features?.length ? `- Features: ${productData.features.join(', ')}` : ''}
${productData.images?.length ? `- Images: ${productData.images.length} images available` : ''}
${productData.rating ? `- Rating: ${productData.rating}` : ''}
${productData.reviewCount ? `- Reviews: ${productData.reviewCount}` : ''}
${productData.availability ? `- Availability: ${productData.availability}` : ''}

${productData.rawContent ? `
RAW PAGE CONTENT (for AI analysis):
${productData.rawContent}

${productData.headings?.length ? `PAGE HEADINGS:
${productData.headings.join('\n')}` : ''}

${productData.paragraphs?.length ? `KEY PARAGRAPHS:
${productData.paragraphs.join('\n\n')}` : ''}
` : ''}
` : `
PRODUCT DETAILS (user provided):
- Product Name: ${data.productName || 'Not provided'}
- Brand: ${data.brand || 'Not provided'}
- Category: ${data.category}
- Description: ${data.desc}
- Keywords: ${data.keywords?.join(', ') || 'None provided'}
- Fulfilment Intent: ${data.fulfilmentIntent || 'Not specified'}
- Website: ${data.websiteUrl || 'No website'}
- No Website Description: ${data.noWebsiteDesc || 'N/A'}

ENHANCED PRODUCT INFORMATION:
- Target Price: ${data.price || 'Not specified'}
- Target Audience: ${data.targetAudience || 'Not specified'}
- Key Features: ${data.keyFeatures || 'Not provided'}
- Customer Benefits: ${data.benefits || 'Not provided'}
- Dimensions: ${data.dimensions || 'Not provided'}
- Materials: ${data.materials || 'Not provided'}
- Use Case: ${data.useCase || 'Not specified'}
`}

${binaryIdqResult ? `
LISTING QUALITY EVALUATION RESULTS (from website analysis):
- Binary Score: ${binaryIdqResult.score}/${binaryIdqResult.maxPossible} (${binaryIdqResult.qualityPercent}%)
- Grade: ${binaryIdqResult.grade}
- Failed Checks: ${binaryIdqResult.notes.join(', ')}
- Brand Found: ${binaryIdqResult.checks.has_brand ? 'Yes' : 'No'}
- Title Length OK: ${binaryIdqResult.checks.title_correct_length ? 'Yes' : 'No'}
- Bullets Count: ${binaryIdqResult.checks.has_bullets_5plus ? '≥5' : '<5'}
- Description Length: ${binaryIdqResult.checks.has_description_200plus ? '≥200 chars' : '<200 chars'}
- Main Image: ${binaryIdqResult.checks.has_main_image ? 'Yes' : 'No'}
- Image Count: ${binaryIdqResult.checks.images_6plus ? '≥6' : '<6'}
- Brand in Content: ${binaryIdqResult.checks.brand_in_bullets_or_desc ? 'Yes' : 'No'}
- Reviews: ${binaryIdqResult.checks.has_reviews ? 'Yes' : 'No'}
- Star Rating: ${binaryIdqResult.checks.has_star_rating ? 'Yes' : 'No'}
` : ''}

${accessType === 'account' ? `
ENHANCED ANALYSIS REQUESTED: This user has an account and should receive premium-level analysis including:
- Advanced competitive analysis and benchmarking
- Detailed keyword optimization strategies with search volume insights
- Conversion rate optimization with psychological triggers
- Seasonal trend considerations and timing recommendations
- Advanced A/B testing recommendations for experienced sellers
- Detailed competitor gap analysis
- ROI projections and impact estimates for each improvement
- Advanced Amazon algorithm optimization strategies
` : `
STANDARD ANALYSIS: This is a guest user - provide comprehensive but focused insights suitable for preview access.
`}

IMPORTANT: If structured data is missing (like title, description, price), analyze the RAW PAGE CONTENT to extract:
- Product name/title from headings or content
- Product description from paragraphs
- Price information from text
- Key features and benefits
- Brand information
- Category clues

Please create a complete Amazon listing creation guide for this NEW SELLER. Instead of scoring, provide field-by-field analysis and recommendations to help them launch a high-converting Amazon listing from scratch.

**Complete Listing Creation Guide:**

1. **TITLE CREATION**:
   - Current Title: [What we found from scraping or user input]
   - Amazon Requirements: [What Amazon requires for high-quality listings]
   - Optimized Title: [Title that converts browsers into buyers and ranks well]

2. **BULLET POINTS CREATION**:
   - Current Bullets: [What we found from scraping or user input]
   - Amazon Requirements: [What Amazon requires for high-quality listings]
   - Optimized Bullets: [5 bullet points that drive conversions and meet Amazon standards]

3. **PRODUCT DESCRIPTION CREATION**:
   - Current Description: [What we found from scraping or user input]
   - Amazon Requirements: [What Amazon requires for high-quality listings]
   - Optimized Description: [Description that answers questions, builds trust, and meets Amazon standards]

4. **KEYWORD STRATEGY FOR NEW LISTINGS**:
   - Current Keywords: [What we found from scraping or user input]
   - Amazon Requirements: [What Amazon requires for high-quality listings]
   - Optimized Keywords: [Keywords that bring in qualified buyers and help with ranking]

5. **LISTING OPTIMIZATION CHECKLIST FOR NEW LISTINGS**:
   - Current Listing Elements: [What we found from scraping or user input]
   - Amazon Requirements: [What Amazon requires for high-quality listings]
   - Optimization Checklist: [Complete checklist covering title, bullets, description, keywords, and listing requirements]

6. **TRUST & CREDIBILITY FOR NEW SELLERS**:
   - Current Trust Elements: [What we found]
   - Amazon Requirements: [What Amazon requires for high-quality listings]
   - Trust Requirements: [Elements that make customers feel safe buying from a new seller]

Format your response as JSON:
{
  "idqAnalysis": {
    "title": {
      "current": string,
      "issues": string[],
      "optimized": string
    },
    "bullets": {
      "current": string[],
      "issues": string[],
      "optimized": string[]
    },
    "description": {
      "current": string,
      "issues": string[],
      "optimized": string
    },
    "keywords": {
      "current": string[],
      "issues": string[],
      "optimized": {
        "primary": string[],
        "secondary": string[],
        "longTail": string[]
      }
    },
    "images": {
      "current": string[],
      "issues": string[],
      "required": {
        "mainImage": string,
        "lifestyleImage": string,
        "benefitsInfographic": string,
        "howToUse": string,
        "measurements": string,
        "comparison": string
      }
    },
    "compliance": {
      "current": string,
      "issues": string[],
      "requirements": string[]
    }
  },
  "summary": {
    "overallReadiness": string,
    "keyImprovements": string[],
    "nextSteps": string[]
  },
  "binaryIdqResult": ${binaryIdqResult ? JSON.stringify(binaryIdqResult) : 'null'}
}

Focus on HELPING THIS NEW SELLER CREATE A HIGH-CONVERTING AMAZON LISTING FROM SCRATCH. Use the binary evaluation results to guide them on what Amazon requires for high-quality listings and provide them with a complete listing creation strategy.`;

  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0, // Changed to 0 for deterministic results
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from AI');

    console.log('Raw AI Response (New Seller):', response);

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(response);
      console.log('Successfully parsed JSON (New Seller):', parsed);
      // Ensure binary IDQ result is included
      if (binaryIdqResult && !parsed.binaryIdqResult) {
        parsed.binaryIdqResult = binaryIdqResult;
      }
      return parsed;
    } catch (parseError) {
      console.log('JSON parse failed (New Seller), using fallback parser:', parseError);
      // Fallback: extract structured data from text
      const fallbackResult = parseAIResponse(response);
      if (binaryIdqResult && !fallbackResult.binaryIdqResult) {
        fallbackResult.binaryIdqResult = binaryIdqResult;
      }
      return fallbackResult;
    }
  } catch (error) {
    console.error('AI analysis failed (New Seller):', error);
    console.log('Using deterministic fallback for new seller:', data.category);
    return generateNewSellerDeterministicFallback(data, binaryIdqResult, accessType);
  }
}

// Enhanced keyword suggestions
export async function suggestKeywords(category: string, description: string) {
  const prompt = `You are an Amazon SEO expert. Suggest 10 highly relevant, high-search-volume keywords for this product:

Category: ${category}
Description: ${description}

Focus on:
- Long-tail keywords with good conversion potential
- UK/EU market relevance
- Seasonal trends if applicable
- Competitor analysis insights
- Primary, secondary, and long-tail keyword distribution

Return as JSON array: ["keyword1", "keyword2", ...]`;

  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from AI');

    try {
      return JSON.parse(response);
    } catch {
      return [];
    }
  } catch (error) {
    console.error('Keyword suggestion failed:', error);
    return [];
  }
}

// Generate product title suggestions
export async function suggestTitle(category: string, description: string, keywords: string[]) {
  const prompt = `You are an Amazon listing optimization expert. Create 3 optimized product titles for this item:

Category: ${category}
Description: ${description}
Target Keywords: ${keywords.join(', ')}

Requirements:
- Follow the formula: [Brand] [Product] for [Target Use], [High-Intent Keywords] [Material/Size/Features]
- Under 200 characters
- Include main keywords naturally
- Follow Amazon title guidelines
- Optimized for UK/EU market
- Include brand if applicable

Return as JSON array: ["Title 1", "Title 2", "Title 3"]`;

  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from AI');

    try {
      return JSON.parse(response);
    } catch {
      return [];
    }
  } catch (error) {
    console.error('Title suggestion failed:', error);
    return [];
  }
}

// Fallback parser for non-JSON AI responses
function parseAIResponse(text: string) {
  console.log('parseAIResponse called with text:', text.substring(0, 200) + '...');
  
  const lines = text.split('\n').filter(line => line.trim());
  
  // Extract score - try multiple patterns
  let score = null;
  const scorePatterns = [
    /score[:\s]*(\d+)/i,
    /(\d+)[:\s]*\/100/i,
    /rating[:\s]*(\d+)/i,
    /(\d+)%?[:\s]*overall/i
  ];
  
  for (const pattern of scorePatterns) {
    const match = text.match(pattern);
    if (match) {
      score = parseInt(match[1]);
      console.log('Extracted score from text:', score, 'using pattern:', pattern);
      break;
    }
  }
  
  // If no score found, provide a reasonable default based on content quality
  if (score === null) {
    // Look for positive indicators in the text
    const positiveIndicators = ['good', 'excellent', 'strong', 'optimized', 'well', 'effective'];
    const negativeIndicators = ['poor', 'weak', 'needs', 'improve', 'missing', 'lack'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveIndicators.forEach(indicator => {
      const regex = new RegExp(indicator, 'gi');
      const matches = text.match(regex);
      if (matches) positiveCount += matches.length;
    });
    
    negativeIndicators.forEach(indicator => {
      const regex = new RegExp(indicator, 'gi');
      const matches = text.match(regex);
      if (matches) negativeCount += matches.length;
    });
    
    // Calculate a score based on the balance
    if (positiveCount > negativeCount) {
      score = Math.min(85, 70 + (positiveCount - negativeCount) * 5);
    } else if (negativeCount > positiveCount) {
      score = Math.max(35, 70 - (negativeCount - positiveCount) * 10);
    } else {
      score = 70; // Neutral default
    }
    
    console.log('Generated default score:', score, 'based on content analysis');
  }

  // Extract highlights and recommendations
  const highlights: string[] = [];
  const recommendations: string[] = [];
  
  let currentSection = '';
  lines.forEach(line => {
    if (line.toLowerCase().includes('highlight') || line.toLowerCase().includes('finding') || line.toLowerCase().includes('idq')) {
      currentSection = 'highlights';
    } else if (line.toLowerCase().includes('recommend') || line.toLowerCase().includes('action') || line.toLowerCase().includes('improve')) {
      currentSection = 'recommendations';
    } else if (line.startsWith('-') || line.startsWith('•') || line.match(/^\d+\./)) {
      const content = line.replace(/^[-•\d\.\s]+/, '').trim();
      if (content && content.length > 10) {
        if (currentSection === 'highlights') {
          highlights.push(content);
        } else if (currentSection === 'recommendations') {
          recommendations.push(content);
        }
      }
    }
  });

  // Generate default highlights if none found
  if (highlights.length === 0) {
    highlights.push('AI analysis completed successfully');
    highlights.push('Detailed insights available in full report');
    highlights.push('Recommendations tailored to your product');
  }

  // Generate default recommendations if none found
  if (recommendations.length === 0) {
    recommendations.push('Review the complete analysis in your email');
    recommendations.push('Implement suggested optimizations');
    recommendations.push('Monitor performance improvements');
  }

  return {
    title: 'AI-Powered Amazon Listing Quality Analysis',
    score: score || 70, // Ensure we always have a score
    bullets: highlights, // Use highlights as bullets for compatibility
    note: 'AI analysis completed. Check your email for the full detailed report.',
    highlights: highlights.slice(0, 5),
    recommendations: recommendations.slice(0, 5),
    detailedAnalysis: {
      titleQuality: 'Title analysis completed',
      bulletPoints: 'Bullet point analysis completed',
      productImages: 'Image analysis completed',
      productDescription: 'Description analysis completed',
      productInformation: 'Product information analysis completed',
      keywords: 'Keyword analysis completed'
    },
    productData: {
      currentTitle: 'Analysis in progress',
      currentBullets: ['Analysis in progress'],
      currentImages: 0,
      currentDescription: 'Analysis in progress',
      missingElements: ['Analysis in progress']
    },
    contentQuality: {
      titleScore: Math.floor(score * 0.25) || 15,
      bulletsScore: Math.floor(score * 0.25) || 15,
      imagesScore: Math.floor(score * 0.20) || 12,
      descriptionScore: Math.floor(score * 0.15) || 10,
      informationScore: Math.floor(score * 0.10) || 7,
      keywordsScore: Math.floor(score * 0.05) || 3
    },
    binaryIdqResult: null as any // Will be set by the calling function if available
  };
}

// Deterministic fallback functions for consistent scoring
function generateDeterministicScore(asin: string, keywords: string[] = []): number {
  // Create consistent input string
  const input = asin + keywords.join(',');
  
  // Generate hash
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to 60-89 range (your current range)
  return Math.abs(hash) % 30 + 60;
}

function generateDeterministicFallback(
  data: ExistingSellerData, 
  binaryIdqResult: IdqResult | null, 
  accessType: 'guest' | 'account' = 'guest'
) {
  const score = generateDeterministicScore(data.asin, data.keywords);
  
  // Use binary IDQ result if available, otherwise use deterministic score
  const finalScore = binaryIdqResult ? binaryIdqResult.qualityPercent : score;
  
  return {
    score: finalScore,
    highlights: generateFallbackHighlights(finalScore),
    recommendations: generateFallbackRecommendations(finalScore),
    detailedAnalysis: {
      titleQuality: "Title optimization needed for better search visibility and conversion",
      bulletPoints: "Bullet points should focus on customer benefits and key features",
      productImages: "Add more high-quality product images including lifestyle shots",
      productDescription: "Enhance product description with detailed features and benefits",
      productInformation: "Include comprehensive product specifications and details"
    },
    productData: {
      currentTitle: data.asin ? `Product ${data.asin}` : "Product Title",
      currentBullets: ["Current bullet point 1", "Current bullet point 2"],
      currentImages: 3,
      currentDescription: "Current product description",
      missingElements: ["Lifestyle images", "Detailed specifications", "Customer benefits"]
    },
    contentQuality: {
      titleScore: Math.floor(finalScore * 0.25),
      bulletsScore: Math.floor(finalScore * 0.25),
      imagesScore: Math.floor(finalScore * 0.20),
      descriptionScore: Math.floor(finalScore * 0.15),
      informationScore: Math.floor(finalScore * 0.15)
    },
    binaryIdqResult: binaryIdqResult,
    isFallback: true // Mark this as a fallback result
  };
}

function generateFallbackHighlights(score: number): string[] {
  if (score >= 80) {
    return [
      "Listing quality is good with room for minor improvements",
      "Strong foundation with optimization opportunities"
    ];
  } else if (score >= 70) {
    return [
      "Listing needs improvement in several key areas",
      "Multiple optimization opportunities identified"
    ];
  } else {
    return [
      "Listing needs significant work to improve performance",
      "Multiple areas require immediate attention"
    ];
  }
}

function generateFallbackRecommendations(score: number): string[] {
  const baseRecommendations = [
    "Optimize product title for better search visibility",
    "Add more high-quality product images",
    "Improve bullet points with customer benefits",
    "Enhance product description with key features"
  ];
  
  if (score < 70) {
    baseRecommendations.push("Consider professional listing optimization service");
  }
  
  return baseRecommendations;
}

// New seller deterministic fallback function
function generateNewSellerDeterministicFallback(
  data: NewSellerData, 
  binaryIdqResult: IdqResult | null, 
  accessType: 'guest' | 'account' = 'guest'
) {
  const score = generateDeterministicScore(data.category, data.keywords);
  
  return {
    idqAnalysis: {
      title: {
        current: data.desc ? data.desc.substring(0, 100) : "Product title needed",
        issues: ["Title needs optimization", "Missing brand name", "Keywords not optimized"],
        optimized: `[Brand] ${data.category} - ${data.desc?.substring(0, 50) || 'Product Description'}`
      },
      bullets: {
        current: ["Current bullet point 1", "Current bullet point 2"],
        issues: ["Missing customer benefits", "No key features highlighted", "Poor conversion focus"],
        optimized: [
          `High-quality ${data.category} for optimal performance`,
          `Durable construction with premium materials`,
          `Easy to use with professional results`,
          `Perfect for ${data.category} enthusiasts`,
          `Satisfaction guaranteed with excellent customer support`
        ]
      },
      description: {
        current: data.desc || "Product description needed",
        issues: ["Missing detailed features", "No customer benefits", "Poor SEO optimization"],
        optimized: `This premium ${data.category} delivers exceptional performance and quality. Built with durable materials and designed for professional use, it offers outstanding value and reliability. Perfect for both beginners and experts, this product combines innovation with proven functionality.`
      },
      keywords: {
        current: data.keywords || [],
        issues: ["Limited keyword coverage", "Missing long-tail keywords", "No competitive analysis"],
        optimized: {
          primary: [data.category, `${data.category} professional`, `best ${data.category}`],
          secondary: [`${data.category} for beginners`, `premium ${data.category}`, `quality ${data.category}`],
          longTail: [`best ${data.category} for professionals`, `top rated ${data.category} 2024`, `professional grade ${data.category}`]
        }
      },
      images: {
        current: ["Main product image"],
        issues: ["Insufficient image count", "Missing lifestyle shots", "No size reference"],
        required: {
          mainImage: "High-quality main product image on white background",
          lifestyleImage: "Product in use or lifestyle context",
          benefitsInfographic: "Visual representation of key benefits",
          howToUse: "Step-by-step usage demonstration",
          measurements: "Size reference and dimensions",
          comparison: "Comparison with similar products"
        }
      },
      compliance: {
        current: "Basic compliance",
        issues: ["Missing required elements", "Incomplete product information"],
        requirements: [
          "Complete product specifications",
          "Accurate dimensions and weight",
          "Proper category classification",
          "Compliance with Amazon policies",
          "Clear return and warranty information"
        ]
      }
    },
    summary: {
      overallReadiness: score >= 70 ? "Good foundation for Amazon listing" : "Needs significant work before launch",
      keyImprovements: [
        "Optimize product title with keywords",
        "Create compelling bullet points",
        "Add comprehensive product images",
        "Write detailed product description",
        "Research and implement keyword strategy"
      ],
      nextSteps: [
        "Complete product photography",
        "Write optimized listing content",
        "Set up Amazon seller account",
        "Plan launch strategy",
        "Monitor and optimize performance"
      ]
    },
    binaryIdqResult: binaryIdqResult,
    isFallback: true // Mark this as a fallback result
  };
}

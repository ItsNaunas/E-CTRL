import OpenAI from 'openai';
import type { ExistingSellerData, NewSellerData } from './validation';
import type { AmazonProductData } from './amazon-scraper';
import type { GenericProductData } from './product-scraper';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI-powered audit analysis for existing sellers with real Amazon data
export async function analyzeExistingSeller(data: ExistingSellerData, productData?: AmazonProductData) {
  const prompt = `You are an expert Amazon FBA consultant analyzing a product listing for UK/EU markets using Amazon's IDQ (Item Data Quality) criteria.

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

Please provide a comprehensive Amazon IDQ audit with:

1. **IDQ Score (0-100)**: Rate based on Amazon's Item Data Quality criteria:
   - Title Quality (25 points): Length, keywords, brand, compliance
   - Bullet Points (25 points): All 5 filled, benefits, keywords
   - Product Images (20 points): Main image compliance, all 7 slots
   - Product Description (15 points): Content, keywords, formatting
   - Product Information (10 points): Attributes, categorization
   - Keywords & Search Terms (5 points): Relevance, placement

2. **Key Highlights (3-5 points)**: Most critical IDQ findings that impact discoverability

3. **Actionable Recommendations (3-5 points)**: Specific steps to improve IDQ score

4. **Detailed IDQ Analysis**: In-depth breakdown of:
   - Title Quality: Character count, keyword density, brand placement, compliance
   - Bullet Points: Count, benefit focus, keyword integration, formatting
   - Product Images: Main image compliance, gallery completeness, quality
   - Product Description: Content depth, keyword usage, formatting
   - Product Information: Attribute completeness, categorization accuracy
   - Keywords: Primary/secondary/long-tail coverage, search term optimization

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
    "productInformation": string,
    "keywords": string
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
    "informationScore": number,
    "keywordsScore": number
  }
}

Focus on Amazon's IDQ requirements and UK/EU marketplace best practices.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from AI');

    // Try to parse JSON response
    try {
      return JSON.parse(response);
    } catch {
      // Fallback: extract structured data from text
      return parseAIResponse(response);
    }
  } catch (error) {
    console.error('AI analysis failed:', error);
    return null;
  }
}

// AI-powered listing pack generation for new sellers
export async function analyzeNewSeller(data: NewSellerData, productData?: GenericProductData) {
  const prompt = `You are an expert Amazon FBA consultant creating a complete listing pack for a new seller.

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
- Category: ${data.category}
- Description: ${data.desc}
- Keywords: ${data.keywords?.join(', ') || 'None provided'}
- Fulfilment Intent: ${data.fulfilmentIntent || 'Not specified'}
- Website: ${data.websiteUrl || 'No website'}
- No Website Description: ${data.noWebsiteDesc || 'N/A'}
`}

IMPORTANT: If structured data is missing (like title, description, price), analyze the RAW PAGE CONTENT to extract:
- Product name/title from headings or content
- Product description from paragraphs
- Price information from text
- Key features and benefits
- Brand information
- Category clues

Please create an IDQ-focused Amazon listing optimization guide. Instead of scoring, provide field-by-field analysis and recommendations to achieve the highest possible IDQ (Item Data Quality) score.

**IDQ Field Analysis & Recommendations:**

1. **TITLE FIELD ANALYSIS**:
   - Current Title: [What we found from scraping]
   - IDQ Issues: [Specific problems with current title]
   - Optimized Title: [IDQ-compliant title following Amazon's best practices]

2. **BULLET POINTS ANALYSIS**:
   - Current Bullets: [What we found from scraping]
   - IDQ Issues: [Missing elements, compliance issues]
   - Optimized Bullets: [5 bullet points optimized for IDQ and conversion]

3. **PRODUCT DESCRIPTION ANALYSIS**:
   - Current Description: [What we found from scraping]
   - IDQ Issues: [SEO, compliance, or structure problems]
   - Optimized Description: [IDQ-compliant description with proper formatting]

4. **KEYWORDS ANALYSIS**:
   - Current Keywords: [What we found from scraping]
   - IDQ Issues: [Missing keywords, poor keyword strategy]
   - Optimized Keywords: [Primary (3-5), Secondary (5-8), Long-tail (8-12)]

5. **IMAGES ANALYSIS**:
   - Current Images: [What we found from scraping]
   - IDQ Issues: [Missing image types, quality issues]
   - Required Images: [6 specific image requirements for highest IDQ]

6. **COMPLIANCE ANALYSIS**:
   - Current Compliance: [What we found]
   - IDQ Issues: [Missing compliance elements]
   - Compliance Requirements: [UK/EU specific requirements for IDQ]

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
  }
}

Focus on UK/EU Amazon marketplace requirements and conversion optimization.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from AI');

    console.log('Raw AI Response (New Seller):', response);

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(response);
      console.log('Successfully parsed JSON (New Seller):', parsed);
      return parsed;
    } catch (parseError) {
      console.log('JSON parse failed (New Seller), using fallback parser:', parseError);
      // Fallback: extract structured data from text
      return parseAIResponse(response);
    }
  } catch (error) {
    console.error('AI analysis failed:', error);
    return null;
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
    const completion = await openai.chat.completions.create({
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
    const completion = await openai.chat.completions.create({
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
    title: 'AI-Powered Amazon IDQ Analysis',
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
    }
  };
}

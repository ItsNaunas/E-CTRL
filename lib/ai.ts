import OpenAI from 'openai';
import type { ExistingSellerData, NewSellerData } from './validation';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI-powered audit analysis for existing sellers
export async function analyzeExistingSeller(data: ExistingSellerData) {
  const prompt = `You are an expert Amazon FBA consultant analyzing a product listing for UK/EU markets.

Product Details:
- ASIN: ${data.asin}
- Keywords: ${data.keywords?.join(', ') || 'None provided'}
- Fulfilment: ${data.fulfilment || 'Not specified'}

Please provide a comprehensive Amazon listing audit with:

1. **Score (0-100)**: Rate the overall listing quality based on:
   - Title optimization (20 points)
   - Bullet point effectiveness (25 points)
   - Image quality and compliance (20 points)
   - SEO coverage and keyword strategy (20 points)
   - Competitive positioning (15 points)

2. **Key Highlights (3-5 points)**: Most critical findings that impact conversion

3. **Actionable Recommendations (3-5 points)**: Specific, implementable steps to improve

4. **Detailed Analysis**: In-depth breakdown of:
   - Title optimization: Length, keyword placement, brand positioning
   - Bullet point effectiveness: Benefit-focused structure, keyword integration
   - Image quality assessment: Compliance, conversion optimization, gallery completeness
   - Keyword strategy: Primary/secondary/long-tail coverage, search volume analysis
   - Competitive positioning: Price positioning, differentiation opportunities

Format your response as JSON:
{
  "score": number,
  "highlights": string[],
  "recommendations": string[],
  "detailedAnalysis": {
    "title": string,
    "bullets": string,
    "images": string,
    "keywords": string,
    "competition": string
  }
}

Focus on UK/EU Amazon marketplace best practices and conversion optimization.`;

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
export async function analyzeNewSeller(data: NewSellerData) {
  const prompt = `You are an expert Amazon FBA consultant creating a complete listing pack for a new seller.

Product Details:
- Category: ${data.category}
- Description: ${data.desc}
- Keywords: ${data.keywords?.join(', ') || 'None provided'}
- Fulfilment Intent: ${data.fulfilmentIntent || 'Not specified'}
- Website: ${data.websiteUrl || 'No website'}
- No Website Description: ${data.noWebsiteDesc || 'N/A'}

Please create a comprehensive Amazon listing pack with:

1. **Score (0-100)**: Rate the overall readiness for Amazon launch based on:
   - Product positioning clarity (25 points)
   - Category competitiveness (20 points)
   - Keyword opportunity (20 points)
   - Compliance readiness (15 points)
   - Marketing potential (20 points)

2. **Key Highlights (3-5 points)**: Most important findings about product potential

3. **Actionable Recommendations (3-5 points)**: Specific steps to prepare for launch

4. **Complete Listing Pack**:
   - **Title**: Follow the formula: [Brand] [Product] for [Target Use], [High-Intent Keywords] [Material/Size/Features]
   - **5-7 Bullet Points**: Each structured as [PRODUCT BENEFIT] – [feature description with keywords]
   - **Product Description**: Optimized for indexing with keyword integration and benefit reinforcement
   - **Keyword Sets**: Primary (3-5), Secondary (5-8), Long-tail (8-12)
   - **Image Gallery Plan**: 6-image structure with specific requirements for each

Format your response as JSON:
{
  "score": number,
  "highlights": string[],
  "recommendations": string[],
  "detailedAnalysis": {
    "positioning": string,
    "competition": string,
    "launchStrategy": string,
    "compliance": string,
    "marketing": string
  },
  "listingPack": {
    "title": string,
    "bullets": string[],
    "description": string,
    "keywords": {
      "primary": string[],
      "secondary": string[],
      "longTail": string[]
    },
    "imageGallery": {
      "mainImage": string,
      "lifestyleImage": string,
      "benefitsInfographic": string,
      "howToUse": string,
      "measurements": string,
      "comparison": string
    }
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
  const lines = text.split('\n').filter(line => line.trim());
  
  // Extract score
  const scoreMatch = text.match(/score[:\s]*(\d+)/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;

  // Extract highlights and recommendations
  const highlights: string[] = [];
  const recommendations: string[] = [];
  
  let currentSection = '';
  lines.forEach(line => {
    if (line.toLowerCase().includes('highlight') || line.toLowerCase().includes('finding')) {
      currentSection = 'highlights';
    } else if (line.toLowerCase().includes('recommend') || line.toLowerCase().includes('action')) {
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

  return {
    score,
    highlights: highlights.slice(0, 5),
    recommendations: recommendations.slice(0, 5),
    detailedAnalysis: {
      summary: text.substring(0, 500) + '...'
    }
  };
}

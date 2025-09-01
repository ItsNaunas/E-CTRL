import type { ExistingSellerData, NewSellerData } from './validation';

export interface SummaryResult {
  title: string;
  score: number;
  bullets: string[];
  note: string;
  highlights?: string[];
  recommendations?: string[];
  listingPack?: {
    title: string;
    bullets: string[];
    description: string;
    keywords: {
      primary: string[];
      secondary: string[];
      longTail: string[];
    };
    imageGallery: {
      mainImage: string;
      lifestyleImage: string;
      benefitsInfographic: string;
      howToUse: string;
      measurements: string;
      comparison: string;
    };
  };
}

// Mock summary generator for existing Amazon sellers
export function mockExistingSummary(input: ExistingSellerData): SummaryResult {
  // Create deterministic-ish results based on input
  const asinHash = input.asin.length;
  const baseScore = 65 + (asinHash % 25); // Score between 65-89
  
  const suggestions = [
    "Add a missing keyword to the title for relevance",
    "Main image meets size; confirm pure white background", 
    "Consider adding more bullet points to highlight key features",
    "Price positioning looks competitive for your category",
    "Backend keywords could be optimized for better discoverability"
  ];

  // Pick 3 suggestions based on input
  const selectedSuggestions = suggestions
    .filter((_, index) => (asinHash + index) % 2 === 0)
    .slice(0, 3);

  return {
    title: "Listing Summary (Mock)",
    score: baseScore,
    bullets: [
      `Listing score: ${baseScore}/100 (mock)`,
      ...selectedSuggestions,
    ],
    note: "We'll email your comprehensive report with detailed recommendations.",
    highlights: [
      "Listing structure follows Amazon best practices",
      "Keyword optimization shows good market understanding",
      "Product presentation is competitive in your category"
    ],
    recommendations: [
      "Optimize backend keywords for better discoverability",
      "Enhance bullet points with more specific benefits",
      "Consider adding A+ Content to improve conversion rates"
    ]
  };
}

// Mock summary generator for new sellers
export function mockNewSummary(input: NewSellerData): SummaryResult {
  // Create deterministic results based on category and description
  const categoryHash = input.category.length;
  const descHash = input.desc.length;
  const baseScore = 60 + ((categoryHash + descHash) % 30); // Score between 60-89

  const categoryAdvice = {
    "Home & Garden": "Category has moderate competition—focus on unique selling points",
    "Electronics": "Highly competitive category—ensure compliance with safety standards", 
    "Fashion": "Image quality will be crucial—invest in professional photography",
    "Health & Beauty": "Category requires careful compliance—review Amazon's guidelines",
    "Sports & Outdoors": "Seasonal trends matter—plan inventory accordingly"
  };

  const advice = categoryAdvice[input.category as keyof typeof categoryAdvice] || 
    "Category is moderately competitive—emphasise benefits in bullets";

  const tips = [
    advice,
    "Your keyword selection shows good market understanding",
    "Product description provides clear value proposition",
    "Consider A+ Content to showcase product benefits",
    "Fulfilment method aligns well with product type"
  ];

  // Pick 3 tips based on input characteristics
  const selectedTips = tips
    .filter((_, index) => (categoryHash + index) % 2 === 0)
    .slice(0, 3);

  // Generate mock listing pack data
  const mockListingPack = {
    title: `${input.desc} - Premium ${input.category} Solution`,
    bullets: [
      `High-quality ${input.category.toLowerCase()} designed for optimal performance`,
      `Easy to use and maintain with clear instructions included`,
      `Competitive pricing with excellent value for money`,
      `Fast shipping and reliable customer support available`,
      `Perfect for both beginners and experienced users`
    ],
    description: `Experience the difference with our premium ${input.category.toLowerCase()} solution. This carefully crafted product offers exceptional quality and performance, making it the ideal choice for your needs. With our commitment to customer satisfaction and competitive pricing, you can trust that you're getting the best value available.`,
    keywords: {
      primary: [input.category.toLowerCase(), input.desc.split(' ')[0], "premium"],
      secondary: ["quality", "performance", "reliable", "affordable"],
      longTail: [`best ${input.category.toLowerCase()}`, `${input.desc} review`, "top rated"]
    },
    imageGallery: {
      mainImage: "Professional product shot on white background",
      lifestyleImage: "Product in use showing real-world application",
      benefitsInfographic: "Visual chart highlighting key benefits and features",
      howToUse: "Step-by-step usage instructions with clear visuals",
      measurements: "Detailed size and dimension specifications",
      comparison: "Side-by-side comparison with competitor products"
    }
  };

  return {
    title: "Readiness Summary (Mock)",
    score: baseScore,
    bullets: [
      `Readiness score: ${baseScore}/100 (mock)`,
      ...selectedTips,
    ],
    note: "We'll email your full report with image recommendations and next steps.",
    highlights: [
      "Your product concept shows strong market potential",
      "Category selection aligns with current market trends",
      "Description effectively communicates value proposition"
    ],
    recommendations: [
      "Invest in professional product photography",
      "Develop comprehensive keyword strategy",
      "Create compelling A+ Content for enhanced conversion"
    ],
    listingPack: mockListingPack
  };
}

// Generate mock ASIN for demo purposes
export function generateMockASIN(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Extract ASIN from Amazon URL
export function extractASIN(input: string): string | null {
  // If it's already an ASIN (10 alphanumeric characters)
  if (/^[A-Z0-9]{10}$/.test(input)) {
    return input;
  }
  
  // Try to extract from URL
  const match = input.match(/\/dp\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}

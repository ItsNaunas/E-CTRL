import type { ExistingSellerData, NewSellerData } from './validation';

export interface SummaryResult {
  title: string;
  score: number;
  bullets: string[];
  note: string;
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

  return {
    title: "Readiness Summary (Mock)",
    score: baseScore,
    bullets: [
      `Readiness score: ${baseScore}/100 (mock)`,
      ...selectedTips,
    ],
    note: "We'll email your full report with image recommendations and next steps.",
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

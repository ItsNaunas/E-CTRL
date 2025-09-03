export interface SummaryResult {
  title: string;
  score: number;
  bullets: string[];
  note: string;
  highlights?: string[];
  recommendations?: string[];
  detailedAnalysis?: {
    summary?: string;
    title?: string;
    bullets?: string;
    images?: string;
    keywords?: string;
    competition?: string;
    positioning?: string;
    launchStrategy?: string;
    compliance?: string;
    marketing?: string;
  };
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

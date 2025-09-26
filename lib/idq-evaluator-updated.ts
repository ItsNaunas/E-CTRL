// Updated IDQ evaluator with shared rating extraction
// This shows the exact changes needed for lib/idq-evaluator.ts

import { extractRatingFromHtml } from './rating-extractor';

// In the evaluateIdq function, replace the extractRatingFromHtml function (lines 587-625) with:
// Just use the imported function - no need to redefine it

// Remove the entire extractRatingFromHtml function from idq-evaluator.ts
// and use the imported one from rating-extractor.ts

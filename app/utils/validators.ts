export interface ValidationResult {
  isValid: boolean;
  error?: string;
  parsedValue?: string;
}

export function isValidEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, parsedValue: email.trim().toLowerCase() };
}

export function parseAsinOrUrl(input: string): ValidationResult {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'ASIN or URL is required' };
  }
  
  // Check if it's a standalone ASIN (10 characters, alphanumeric)
  const asinRegex = /^[A-Z0-9]{10}$/;
  if (asinRegex.test(trimmed)) {
    return { isValid: true, parsedValue: trimmed };
  }
  
  // Check if it's a URL
  if (trimmed.includes('amazon.') || trimmed.includes('http') || trimmed.includes('amzn.') || trimmed.includes('a.co')) {
    
    // Comprehensive Amazon URL patterns
    const amazonPatterns = [
      // Standard dp/product patterns with flexible endings
      /(?:[/dp/]|product[/]|gp\/product\/)([A-Z0-9]{10})(?:[/?&]|$)/,
      
      // Shortened URLs (amzn.to, a.co, amzn.com)
      /(?:amzn\.to\/|a\.co\/d\/|amzn\.com\/)([A-Z0-9]{10})(?:[/?&]|$)/,
      
      // Mobile/Smile domains with flexible patterns
      /(?:m\.|smile\.)?amazon\.[a-z.]+\/(?:dp\/|product\/|gp\/product\/)([A-Z0-9]{10})(?:[/?&]|$)/,
      
      // Handle URLs with product names before ASIN
      /\/dp\/([A-Z0-9]{10})(?:[/?&]|$)/,
      
      // Handle product URLs with different structures
      /\/product\/([A-Z0-9]{10})(?:[/?&]|$)/,
      
      // Handle gp/product URLs
      /\/gp\/product\/([A-Z0-9]{10})(?:[/?&]|$)/
    ];
    
    // Try each pattern until we find a match
    for (const pattern of amazonPatterns) {
      const asinMatch = trimmed.match(pattern);
      if (asinMatch && asinMatch[1]) {
        // Validate that the extracted ASIN is 10 characters
        if (asinMatch[1].length === 10 && /^[A-Z0-9]{10}$/.test(asinMatch[1])) {
          return { isValid: true, parsedValue: asinMatch[1] };
        }
      }
    }
    
    // If it's a valid Amazon URL but no ASIN found
    if (trimmed.includes('amazon.') || trimmed.includes('amzn.') || trimmed.includes('a.co')) {
      return { isValid: false, error: 'Please enter a valid Amazon product URL with ASIN' };
    }
  }
  
  return { isValid: false, error: 'Please enter a valid ASIN (10 characters) or Amazon product URL' };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
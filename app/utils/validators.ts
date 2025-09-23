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
  
  // Check if it's a URL
  if (trimmed.includes('amazon.') || trimmed.includes('http')) {
    // Extract ASIN from Amazon URL
    const asinMatch = trimmed.match(/(?:[/dp/]|product[/])([A-Z0-9]{10})(?:[/?]|$)/);
    if (asinMatch) {
      return { isValid: true, parsedValue: asinMatch[1] };
    }
    
    // If it's a valid URL but no ASIN found
    if (trimmed.includes('amazon.')) {
      return { isValid: false, error: 'Please enter a valid Amazon product URL' };
    }
  }
  
  // Check if it's a standalone ASIN (10 characters, alphanumeric)
  const asinRegex = /^[A-Z0-9]{10}$/;
  if (asinRegex.test(trimmed)) {
    return { isValid: true, parsedValue: trimmed };
  }
  
  return { isValid: false, error: 'Please enter a valid ASIN (10 characters) or Amazon product URL' };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

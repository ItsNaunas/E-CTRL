import { 
  existingSellerSchema, 
  newSellerSchema 
} from '@/lib/validation'

describe('Validation Integration Tests', () => {
  describe('Complete Form Validation', () => {
    test('should validate complete existing seller form data', () => {
      const formData = {
        asin: 'B08N5WRWNW',
        name: 'John Doe',
        email: 'john@example.com',
        keywords: ['test', 'product', 'amazon'],
        fulfilment: 'FBA' as const,
        phone: '+1234567890'
      }

      const result = existingSellerSchema.safeParse(formData)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.asin).toBe('B08N5WRWNW')
        expect(result.data.name).toBe('John Doe')
        expect(result.data.email).toBe('john@example.com')
        expect(result.data.keywords).toEqual(['test', 'product', 'amazon'])
      }
    })

    test('should validate complete new seller form data', () => {
      const formData = {
        websiteUrl: 'https://www.example.com',
        category: 'Electronics',
        desc: 'This is a comprehensive product description that meets the minimum character requirement for validation.',
        keywords: ['electronics', 'gadget'],
        fulfilmentIntent: 'FBA' as const,
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1234567890'
      }

      const result = newSellerSchema.safeParse(formData)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.websiteUrl).toBe('https://www.example.com')
        expect(result.data.category).toBe('Electronics')
        expect(result.data.keywords).toEqual(['electronics', 'gadget'])
      }
    })

    test('should handle Amazon URL to ASIN conversion', () => {
      const formData = {
        asin: 'https://www.amazon.com/dp/B08N5WRWNW',
        name: 'Test User',
        email: 'test@example.com'
      }

      const result = existingSellerSchema.safeParse(formData)
      expect(result.success).toBe(true)
    })

    test('should reject incomplete existing seller data', () => {
      const incompleteData = {
        asin: 'B08N5WRWNW',
        name: 'Test User'
        // Missing email
      }

      const result = existingSellerSchema.safeParse(incompleteData)
      expect(result.success).toBe(false)
      
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1)
        expect(result.error.issues[0].path).toContain('email')
      }
    })

    test('should reject new seller data without any input method', () => {
      const invalidData = {
        // Missing websiteUrl, productName, and noWebsiteDesc
        category: 'Electronics',
        desc: 'This is a valid product description with enough characters.',
        keywords: ['test', 'product'],
        fulfilmentIntent: 'FBA' as const,
        name: 'Test User',
        email: 'test@example.com'
      }

      const result = newSellerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    test('should validate edge cases for keyword limits', () => {
      // Test maximum keywords for existing seller
      const maxKeywordsData = {
        asin: 'B08N5WRWNW',
        name: 'Test User',
        email: 'test@example.com',
        keywords: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] // 8 keywords (max)
      }

      const result1 = existingSellerSchema.safeParse(maxKeywordsData)
      expect(result1.success).toBe(true)

      // Test required keywords for new seller
      const minRequiredKeywords = {
        productName: 'Test Product',
        category: 'Electronics',
        desc: 'This is a valid product description with enough characters.',
        keywords: ['keyword1', 'keyword2'], // 2 keywords (min required)
        fulfilmentIntent: 'FBA' as const,
        name: 'Test User',
        email: 'test@example.com'
      }

      const result2 = newSellerSchema.safeParse(minRequiredKeywords)
      expect(result2.success).toBe(true)
    })

    test('should validate description length boundaries', () => {
      // Test minimum description length
      const minDescData = {
        productName: 'Test Product',
        category: 'Electronics',
        desc: 'A'.repeat(12), // Exactly 12 characters (minimum)
        keywords: ['test', 'product'],
        fulfilmentIntent: 'FBA' as const,
        name: 'Test User',
        email: 'test@example.com'
      }

      const result1 = newSellerSchema.safeParse(minDescData)
      expect(result1.success).toBe(true)

      // Test maximum description length
      const maxDescData = {
        productName: 'Test Product',
        category: 'Electronics',
        desc: 'A'.repeat(400), // Exactly 400 characters (maximum)
        keywords: ['test', 'product'],
        fulfilmentIntent: 'FBA' as const,
        name: 'Test User',
        email: 'test@example.com'
      }

      const result2 = newSellerSchema.safeParse(maxDescData)
      expect(result2.success).toBe(true)

      // Test over maximum description length
      const tooLongDescData = {
        productName: 'Test Product',
        category: 'Electronics',
        desc: 'A'.repeat(401), // 401 characters (over maximum)
        keywords: ['test', 'product'],
        fulfilmentIntent: 'FBA' as const,
        name: 'Test User',
        email: 'test@example.com'
      }

      const result3 = newSellerSchema.safeParse(tooLongDescData)
      expect(result3.success).toBe(false)
    })

    test('should handle various email formats', () => {
      const emailTests = [
        { email: 'simple@example.com', shouldPass: true },
        { email: 'user.name@example.com', shouldPass: true },
        { email: 'user+tag@example.com', shouldPass: true },
        { email: 'user@example.co.uk', shouldPass: true },
        { email: 'invalid-email', shouldPass: false },
        { email: '@example.com', shouldPass: false },
        { email: 'user@', shouldPass: false },
        { email: '', shouldPass: false }
      ]

      emailTests.forEach(({ email, shouldPass }) => {
        const testData = {
          asin: 'B08N5WRWNW',
          name: 'Test User',
          email: email
        }

        const result = existingSellerSchema.safeParse(testData)
        expect(result.success).toBe(shouldPass)
      })
    })

    test('should handle optional fields correctly', () => {
      // Test with all optional fields
      const dataWithOptionals = {
        asin: 'B08N5WRWNW',
        name: 'Test User',
        email: 'test@example.com',
        keywords: ['test'],
        fulfilment: 'FBA' as const,
        phone: '+1234567890'
      }

      const result1 = existingSellerSchema.safeParse(dataWithOptionals)
      expect(result1.success).toBe(true)

      // Test without optional fields
      const dataWithoutOptionals = {
        asin: 'B08N5WRWNW',
        name: 'Test User',
        email: 'test@example.com'
      }

      const result2 = existingSellerSchema.safeParse(dataWithoutOptionals)
      expect(result2.success).toBe(true)
    })
  })
})

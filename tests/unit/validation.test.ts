import { 
  asin, 
  email, 
  name, 
  keywords, 
  requiredKeywords,
  shortDesc, 
  category, 
  productUrl,
  existingSellerSchema, 
  newSellerSchema 
} from '@/lib/validation'

describe('Validation Functions', () => {
  describe('ASIN Validation', () => {
    test('should accept valid 10-character ASIN', () => {
      const validASINs = [
        'B08N5WRWNW',
        'B123456789',
        'A1B2C3D4E5',
        '1234567890'
      ]
      
      validASINs.forEach(asinValue => {
        expect(() => asin.parse(asinValue)).not.toThrow()
      })
    })

    test('should accept valid Amazon URLs', () => {
      const validURLs = [
        'https://www.amazon.com/dp/B08N5WRWNW',
        'https://amazon.com/dp/B123456789',
        'https://www.amazon.co.uk/dp/A1B2C3D4E5',
        'https://amazon.de/dp/1234567890'
      ]
      
      validURLs.forEach(url => {
        expect(() => asin.parse(url)).not.toThrow()
      })
    })

    test('should reject invalid ASIN formats', () => {
      const invalidASINs = [
        'invalid',
        'B08N5WRW', // too short
        'B08N5WRWNWX', // too long
        'B08N5WRWN', // 9 characters
        '',
        'B08N5WRWNW!', // special character
        'b08n5wrwnw' // lowercase
      ]
      
      invalidASINs.forEach(asinValue => {
        expect(() => asin.parse(asinValue)).toThrow()
      })
    })

    test('should reject invalid URLs', () => {
      const invalidURLs = [
        'https://www.google.com',
        'https://www.amazon.com/product/123',
        'https://www.amazon.com/dp/',
        'not-a-url',
        'https://www.amazon.com/dp/B08N5WRW' // invalid ASIN in URL
      ]
      
      invalidURLs.forEach(url => {
        expect(() => asin.parse(url)).toThrow()
      })
    })
  })

  describe('Email Validation', () => {
    test('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'test+tag@example.org',
        'user123@test-domain.com'
      ]
      
      validEmails.forEach(emailValue => {
        expect(() => email.parse(emailValue)).not.toThrow()
      })
    })

    test('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test..test@example.com',
        '',
        'test@.com'
      ]
      
      invalidEmails.forEach(emailValue => {
        expect(() => email.parse(emailValue)).toThrow()
      })
    })
  })

  describe('Name Validation', () => {
    test('should accept valid names', () => {
      const validNames = [
        'John Doe',
        'Jane',
        'Test User',
        'AB' // minimum 2 characters
      ]
      
      validNames.forEach(nameValue => {
        expect(() => name.parse(nameValue)).not.toThrow()
      })
    })

    test('should reject invalid names', () => {
      const invalidNames = [
        '',
        'A' // too short
      ]
      
      invalidNames.forEach(nameValue => {
        expect(() => name.parse(nameValue)).toThrow()
      })
    })
  })

  describe('Keywords Validation', () => {
    test('should accept valid keyword arrays', () => {
      const validKeywords = [
        ['keyword1', 'keyword2'],
        ['single'],
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] // max 8
      ]
      
      validKeywords.forEach(keywordsArray => {
        expect(() => keywords.parse(keywordsArray)).not.toThrow()
      })
    })

    test('should reject too many keywords', () => {
      const tooManyKeywords = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'] // 9 keywords
      
      expect(() => keywords.parse(tooManyKeywords)).toThrow()
    })

    test('should accept empty keywords array', () => {
      expect(() => keywords.parse([])).not.toThrow()
    })
  })

  describe('Required Keywords Validation', () => {
    test('should accept 2-5 keywords', () => {
      const validRequiredKeywords = [
        ['keyword1', 'keyword2'],
        ['a', 'b', 'c', 'd', 'e'] // max 5
      ]
      
      validRequiredKeywords.forEach(keywordsArray => {
        expect(() => requiredKeywords.parse(keywordsArray)).not.toThrow()
      })
    })

    test('should reject too few keywords', () => {
      const tooFewKeywords = ['single']
      
      expect(() => requiredKeywords.parse(tooFewKeywords)).toThrow()
    })

    test('should reject too many keywords', () => {
      const tooManyKeywords = ['a', 'b', 'c', 'd', 'e', 'f'] // 6 keywords
      
      expect(() => requiredKeywords.parse(tooManyKeywords)).toThrow()
    })
  })

  describe('Short Description Validation', () => {
    test('should accept valid descriptions', () => {
      const validDescriptions = [
        'This is a valid product description with enough characters.',
        'A'.repeat(12), // minimum length
        'A'.repeat(400) // maximum length
      ]
      
      validDescriptions.forEach(desc => {
        expect(() => shortDesc.parse(desc)).not.toThrow()
      })
    })

    test('should reject descriptions that are too short', () => {
      const tooShortDescriptions = [
        'Too short',
        'A'.repeat(11), // just under minimum
        ''
      ]
      
      tooShortDescriptions.forEach(desc => {
        expect(() => shortDesc.parse(desc)).toThrow()
      })
    })

    test('should reject descriptions that are too long', () => {
      const tooLongDescription = 'A'.repeat(401) // just over maximum
      
      expect(() => shortDesc.parse(tooLongDescription)).toThrow()
    })
  })

  describe('Category Validation', () => {
    test('should accept valid categories', () => {
      const validCategories = [
        'Electronics',
        'Home & Garden',
        'Books',
        'AB' // minimum 2 characters
      ]
      
      validCategories.forEach(categoryValue => {
        expect(() => category.parse(categoryValue)).not.toThrow()
      })
    })

    test('should reject invalid categories', () => {
      const invalidCategories = [
        '',
        'A', // too short
        ' '
      ]
      
      invalidCategories.forEach(categoryValue => {
        expect(() => category.parse(categoryValue)).toThrow()
      })
    })
  })

  describe('Product URL Validation', () => {
    test('should accept valid URLs', () => {
      const validURLs = [
        'https://www.example.com',
        'http://test.com',
        'https://shop.example.com/product/123',
        'https://store.mysite.org'
      ]
      
      validURLs.forEach(url => {
        expect(() => productUrl.parse(url)).not.toThrow()
      })
    })

    test('should reject invalid URLs', () => {
      const invalidURLs = [
        'not-a-url',
        'just-text',
        ''
      ]
      
      invalidURLs.forEach(url => {
        expect(() => productUrl.parse(url)).toThrow()
      })
    })
  })

  describe('Existing Seller Schema', () => {
    test('should validate complete existing seller data', () => {
      const validData = {
        asin: 'B08N5WRWNW',
        name: 'John Doe',
        email: 'john@example.com',
        keywords: ['test', 'product'],
        fulfilment: 'FBA',
        phone: '+1234567890'
      }
      
      expect(() => existingSellerSchema.parse(validData)).not.toThrow()
    })

    test('should validate minimal existing seller data', () => {
      const minimalData = {
        asin: 'B08N5WRWNW',
        name: 'John Doe',
        email: 'john@example.com'
      }
      
      expect(() => existingSellerSchema.parse(minimalData)).not.toThrow()
    })

    test('should reject invalid existing seller data', () => {
      const invalidData = {
        asin: 'invalid',
        name: 'J', // too short
        email: 'invalid-email'
      }
      
      expect(() => existingSellerSchema.parse(invalidData)).toThrow()
    })
  })

  describe('New Seller Schema', () => {
    test('should validate complete new seller data with website URL', () => {
      const validData = {
        websiteUrl: 'https://www.example.com',
        category: 'Electronics',
        desc: 'This is a valid product description with enough characters.',
        keywords: ['test', 'product'],
        fulfilmentIntent: 'FBA',
        name: 'John Doe',
        email: 'john@example.com'
      }
      
      expect(() => newSellerSchema.parse(validData)).not.toThrow()
    })

    test('should validate new seller data with product name', () => {
      const validData = {
        productName: 'Test Product',
        category: 'Electronics',
        desc: 'This is a valid product description with enough characters.',
        keywords: ['test', 'product'],
        fulfilmentIntent: 'FBA',
        name: 'John Doe',
        email: 'john@example.com'
      }
      
      expect(() => newSellerSchema.parse(validData)).not.toThrow()
    })

    test('should validate new seller data with description only', () => {
      const validData = {
        noWebsiteDesc: 'This is a valid product description with enough characters.',
        category: 'Electronics',
        desc: 'This is a valid product description with enough characters.',
        keywords: ['test', 'product'],
        fulfilmentIntent: 'FBA',
        name: 'John Doe',
        email: 'john@example.com'
      }
      
      expect(() => newSellerSchema.parse(validData)).not.toThrow()
    })

    test('should reject new seller data without required fields', () => {
      const invalidData = {
        category: 'Electronics',
        desc: 'This is a valid product description with enough characters.',
        keywords: ['test', 'product'],
        fulfilmentIntent: 'FBA',
        name: 'John Doe',
        email: 'john@example.com'
        // Missing websiteUrl, productName, and noWebsiteDesc
      }
      
      expect(() => newSellerSchema.parse(invalidData)).toThrow()
    })

    test('should reject new seller data with invalid keywords', () => {
      const invalidData = {
        websiteUrl: 'https://www.example.com',
        category: 'Electronics',
        desc: 'This is a valid product description with enough characters.',
        keywords: ['single'], // too few keywords
        fulfilmentIntent: 'FBA',
        name: 'John Doe',
        email: 'john@example.com'
      }
      
      expect(() => newSellerSchema.parse(invalidData)).toThrow()
    })
  })
})

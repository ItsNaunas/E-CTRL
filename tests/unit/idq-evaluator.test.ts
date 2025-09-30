import { evaluateIdq, evaluateIdqWithAI } from '@/lib/idq-evaluator';

describe('IDQ Evaluator v2', () => {
  describe('Score Calculation', () => {
    test('should have max score of 8 points', () => {
      const mockHtml = `
        <span id="bylineInfo">Test Brand</span>
        <span id="productTitle">Test Brand Premium Product Title Here</span>
        <li class="a-list-item">This is bullet point number one with enough text</li>
        <li class="a-list-item">This is bullet point number two with enough text</li>
        <li class="a-list-item">This is bullet point number three with enough text</li>
        <li class="a-list-item">This is bullet point number four with enough text</li>
        <li class="a-list-item">This is bullet point number five with Test Brand mention</li>
        <div id="productDescription">This is a long product description that exceeds 200 characters and mentions Test Brand. It provides detailed information about the product features and benefits that customers need to know before making a purchase decision.</div>
        <img id="landingImage" src="test.jpg" />
        <li class="imageThumbnail">1</li>
        <li class="imageThumbnail">2</li>
        <li class="imageThumbnail">3</li>
        <li class="imageThumbnail">4</li>
        <li class="imageThumbnail">5</li>
        <li class="imageThumbnail">6</li>
      `;
      
      const result = evaluateIdq(mockHtml);
      
      expect(result.maxPossible).toBe(8);
      expect(result.score).toBeLessThanOrEqual(8);
    });

    test('should not include has_reviews check', () => {
      const mockHtml = `
        <span id="bylineInfo">Test Brand</span>
        <span id="productTitle">Test Brand Product</span>
        <span id="acrCustomerReviewText">1,234 ratings</span>
      `;
      
      const result = evaluateIdq(mockHtml);
      
      expect(result.checks).not.toHaveProperty('has_reviews');
    });

    test('should not include has_star_rating check', () => {
      const mockHtml = `
        <span id="bylineInfo">Test Brand</span>
        <span id="productTitle">Test Brand Product</span>
        <span id="acrPopover" aria-label="4.5 out of 5 stars">4.5 stars</span>
      `;
      
      const result = evaluateIdq(mockHtml);
      
      expect(result.checks).not.toHaveProperty('has_star_rating');
    });

    test('should include brand_in_bullets_or_desc check', () => {
      const mockHtml = `
        <span id="bylineInfo">Test Brand</span>
        <span id="productTitle">Test Brand Product</span>
        <li class="a-list-item">This bullet mentions Test Brand</li>
      `;
      
      const result = evaluateIdq(mockHtml);
      
      expect(result.checks).toHaveProperty('brand_in_bullets_or_desc');
      expect(result.checks.brand_in_bullets_or_desc).toBe(1);
    });

    test('should calculate grade correctly for 8-point scale', () => {
      const perfectHtml = `
        <span id="bylineInfo">Test Brand</span>
        <span id="productTitle">Test Brand Premium Product Title Here</span>
        <li class="a-list-item">Bullet point one with enough text here</li>
        <li class="a-list-item">Bullet point two with enough text here</li>
        <li class="a-list-item">Bullet point three with enough text here</li>
        <li class="a-list-item">Bullet point four with enough text here</li>
        <li class="a-list-item">Bullet point five with Test Brand mention</li>
        <div id="productDescription">This is a long product description that exceeds 200 characters and mentions Test Brand. It provides detailed information about the product features and benefits that customers need to know before making a purchase decision.</div>
        <img id="landingImage" src="test.jpg" />
        <li class="imageThumbnail">1</li>
        <li class="imageThumbnail">2</li>
        <li class="imageThumbnail">3</li>
        <li class="imageThumbnail">4</li>
        <li class="imageThumbnail">5</li>
        <li class="imageThumbnail">6</li>
      `;
      
      const result = evaluateIdq(perfectHtml);
      
      // Should get A grade for 7-8 points
      if (result.score >= 7) {
        expect(result.grade).toBe('A');
      } else if (result.score >= 5) {
        expect(result.grade).toBe('B');
      } else {
        expect(result.grade).toBe('C');
      }
    });

    test('should have exactly 8 checks in the interface', () => {
      const mockHtml = `
        <span id="bylineInfo">Test Brand</span>
        <span id="productTitle">Test Brand Product</span>
      `;
      
      const result = evaluateIdq(mockHtml);
      const checkKeys = Object.keys(result.checks);
      
      // Should have 8 core checks (excluding optional relevant_attributes_covered)
      const coreChecks = checkKeys.filter(key => key !== 'relevant_attributes_covered');
      expect(coreChecks.length).toBe(8);
      
      // Verify the exact checks
      expect(coreChecks).toContain('has_brand');
      expect(coreChecks).toContain('title_starts_with_brand');
      expect(coreChecks).toContain('title_correct_length');
      expect(coreChecks).toContain('has_bullets_5plus');
      expect(coreChecks).toContain('has_description_200plus');
      expect(coreChecks).toContain('has_main_image');
      expect(coreChecks).toContain('images_6plus');
      expect(coreChecks).toContain('brand_in_bullets_or_desc');
    });
  });

  describe('AI-powered Evaluation', () => {
    test('should work with extracted data and have 8-point max', async () => {
      const mockExtractedData = {
        brand: 'Test Brand',
        title: 'Test Brand Premium Product',
        bullets: [
          'Bullet one with Test Brand',
          'Bullet two',
          'Bullet three',
          'Bullet four',
          'Bullet five'
        ],
        description: 'This is a long product description that exceeds 200 characters and mentions Test Brand.',
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg'],
        reviewCount: 100,
        rating: 4.5
      };
      
      const result = await evaluateIdqWithAI('', {}, mockExtractedData);
      
      expect(result.maxPossible).toBe(8);
      expect(result.checks).not.toHaveProperty('has_reviews');
      expect(result.checks).not.toHaveProperty('has_star_rating');
      expect(result.checks).toHaveProperty('brand_in_bullets_or_desc');
    });
  });

  describe('Backward Compatibility', () => {
    test('should maintain back-compat fields', () => {
      const mockHtml = `
        <span id="bylineInfo">Test Brand</span>
        <span id="productTitle">Test Brand Product</span>
      `;
      
      const result = evaluateIdq(mockHtml);
      
      // Back-compat fields should still exist
      expect(result).toHaveProperty('qualityScore');
      expect(result).toHaveProperty('qualityGrade');
      expect(result).toHaveProperty('hasImage');
      expect(result).toHaveProperty('hasAplus');
      expect(result).toHaveProperty('bulletPointsCount');
      expect(result).toHaveProperty('totalImages');
    });
  });

  describe('Notes Generation', () => {
    test('should not generate notes for reviews or star rating', () => {
      const mockHtml = `
        <span id="bylineInfo">Test Brand</span>
        <span id="productTitle">Test Brand Product</span>
      `;
      
      const result = evaluateIdq(mockHtml);
      
      const reviewNotes = result.notes.filter(note => 
        note.includes('reviews') || note.includes('star rating')
      );
      
      expect(reviewNotes.length).toBe(0);
    });

    test('should generate note for missing brand in content', () => {
      const mockHtml = `
        <span id="bylineInfo">Test Brand</span>
        <span id="productTitle">Test Brand Product</span>
        <li class="a-list-item">Bullet without brand mention</li>
        <div id="productDescription">Description without brand mention</div>
      `;
      
      const result = evaluateIdq(mockHtml);
      
      const brandContentNote = result.notes.find(note => 
        note.includes('Brand not mentioned in product details')
      );
      
      expect(brandContentNote).toBeDefined();
    });
  });
});

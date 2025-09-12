// Test script to demonstrate the new AI-powered scraper
import { scrapeProduct } from './amazon-scraper';

export async function testScraper(asin: string) {
  console.log(`Testing AI-powered scraper with ASIN: ${asin}`);
  
  try {
    const result = await scrapeProduct(asin);
    
    if ('error' in result) {
      console.error('Scraping failed:', result.error);
      return;
    }
    
    console.log('✅ Scraping successful!');
    console.log('📊 Extracted Data:');
    console.log(`- Title: ${result.title}`);
    console.log(`- Brand: ${result.brand}`);
    console.log(`- Price: ${result.price}`);
    console.log(`- Rating: ${result.rating}/5 (${result.reviewCount} reviews)`);
    console.log(`- Bullets: ${result.bullets.length} bullet points`);
    console.log(`- Images: ${result.images.length} images`);
    console.log(`- Extraction Method: regex`);
    console.log(`- Availability: ${result.availability}`);
    
    // Show first few bullet points
    if (result.bullets.length > 0) {
      console.log('\n📝 Bullet Points:');
      result.bullets.slice(0, 3).forEach((bullet, i) => {
        console.log(`  ${i + 1}. ${bullet.substring(0, 100)}...`);
      });
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Example usage:
// testScraper('B07RSCPH4N'); // Amazon Basics vacuum bags

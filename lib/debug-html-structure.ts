// Debug script to analyze HTML structure
export async function debugHTMLStructure(asin: string) {
  console.log(`🔍 Analyzing HTML structure for ASIN: ${asin}`);
  
  try {
    const url = `https://www.amazon.co.uk/dp/${asin}`;
    console.log(`📡 Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      console.error(`❌ Fetch failed: HTTP ${response.status}`);
      return;
    }

    const html = await response.text();
    console.log(`📄 HTML length: ${html.length} characters`);
    
    // Analyze specific sections
    console.log('\n🔍 HTML Structure Analysis:');
    
    // Check for bullet points
    console.log('\n📝 Bullet Points Analysis:');
    const bulletSections = [
      'a-list-item',
      'a-spacing-mini',
      'a-section a-spacing-medium',
      'a-list-item a-spacing-mini',
      'a-unordered-list',
      'a-list-ordered'
    ];
    
    bulletSections.forEach(section => {
      const matches = html.match(new RegExp(`<[^>]*class="[^"]*${section}[^"]*"[^>]*>([^<]+)<`, 'g'));
      if (matches && matches.length > 0) {
        console.log(`✅ Found ${matches.length} matches for class "${section}":`);
        matches.slice(0, 3).forEach((match, i) => {
          const textMatch = match.match(/<[^>]*class="[^"]*[^"]*"[^>]*>([^<]+)</);
          if (textMatch) {
            console.log(`  ${i + 1}. "${textMatch[1].trim().substring(0, 100)}..."`);
          }
        });
      } else {
        console.log(`❌ No matches for class "${section}"`);
      }
    });
    
    // Check for rating
    console.log('\n⭐ Rating Analysis:');
    const ratingSections = [
      'a-icon-alt',
      'a-star-',
      'a-icon a-icon-star',
      'a-icon-star'
    ];
    
    ratingSections.forEach(section => {
      const matches = html.match(new RegExp(`<[^>]*class="[^"]*${section}[^"]*"[^>]*>([^<]+)<`, 'g'));
      if (matches && matches.length > 0) {
        console.log(`✅ Found ${matches.length} matches for class "${section}":`);
        matches.slice(0, 3).forEach((match, i) => {
          const textMatch = match.match(/<[^>]*class="[^"]*[^"]*"[^>]*>([^<]+)</);
          if (textMatch) {
            console.log(`  ${i + 1}. "${textMatch[1].trim()}"`);
          }
        });
      } else {
        console.log(`❌ No matches for class "${section}"`);
      }
    });
    
    // Check for review count
    console.log('\n📊 Review Count Analysis:');
    const reviewSections = [
      'acrCustomerReviewText',
      'a-size-base',
      'a-link-normal'
    ];
    
    reviewSections.forEach(section => {
      const matches = html.match(new RegExp(`<[^>]*class="[^"]*${section}[^"]*"[^>]*>([^<]+)<`, 'g'));
      if (matches && matches.length > 0) {
        console.log(`✅ Found ${matches.length} matches for class "${section}":`);
        matches.slice(0, 3).forEach((match, i) => {
          const textMatch = match.match(/<[^>]*class="[^"]*[^"]*"[^>]*>([^<]+)</);
          if (textMatch) {
            console.log(`  ${i + 1}. "${textMatch[1].trim()}"`);
          }
        });
      } else {
        console.log(`❌ No matches for class "${section}"`);
      }
    });
    
    // Check for brand
    console.log('\n🏷️ Brand Analysis:');
    const brandSections = [
      'bylineInfo',
      'a-link-normal',
      'a-size-base'
    ];
    
    brandSections.forEach(section => {
      const matches = html.match(new RegExp(`<[^>]*class="[^"]*${section}[^"]*"[^>]*>([^<]+)<`, 'g'));
      if (matches && matches.length > 0) {
        console.log(`✅ Found ${matches.length} matches for class "${section}":`);
        matches.slice(0, 3).forEach((match, i) => {
          const textMatch = match.match(/<[^>]*class="[^"]*[^"]*"[^>]*>([^<]+)</);
          if (textMatch) {
            console.log(`  ${i + 1}. "${textMatch[1].trim()}"`);
          }
        });
      } else {
        console.log(`❌ No matches for class "${section}"`);
      }
    });
    
    // Check for images
    console.log('\n🖼️ Images Analysis:');
    const imageMatches = html.match(/<img[^>]*src="([^"]*)"[^>]*>/g);
    if (imageMatches && imageMatches.length > 0) {
      console.log(`✅ Found ${imageMatches.length} images:`);
      imageMatches.slice(0, 5).forEach((match, i) => {
        const srcMatch = match.match(/src="([^"]*)"/);
        if (srcMatch) {
          console.log(`  ${i + 1}. ${srcMatch[1].substring(0, 100)}...`);
        }
      });
    } else {
      console.log(`❌ No images found`);
    }
    
    // Look for specific text patterns
    console.log('\n🔍 Specific Text Patterns:');
    const textPatterns = [
      'Amazon Basics',
      '4.4 out of 5 stars',
      '129,499 ratings',
      'Set of 5 Large Compression Bags',
      'Space-Saving'
    ];
    
    textPatterns.forEach(pattern => {
      if (html.includes(pattern)) {
        console.log(`✅ Found: "${pattern}"`);
      } else {
        console.log(`❌ Not found: "${pattern}"`);
      }
    });
    
    return html;

  } catch (error) {
    console.error(`❌ Debug failed:`, error);
    return null;
  }
}

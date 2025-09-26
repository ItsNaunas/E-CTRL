// Comprehensive audit test for Amazon URL parsing
const { parseAsinOrUrl } = require('./app/utils/validators.ts');

// Test the complex URL that was failing before
const testUrls = [
  {
    url: 'https://www.amazon.co.uk/Grandma-Grandchildren-Grandmothers-Christmas-Thanksgiving/dp/B0CB8D7MZC/ref=sr_1_6?crid=1LU0TDXZPZ1F9&dib=eyJ2IjoiMSJ9._nHnrRyn6yLl-Ma-zznBCi8ksHUjE0GQeJHUEWzm6WydwjWWRaVTqgzY8QQXc9TJGs9qiEnPAynFmjLEOl3flm19wFzWL6gp_Q30zxV_H_TDwwUwAMcPhI0PeDEctnwECxz0jxcN3a7ZKWNEFsy1FMGDHw-SJFNJc1TM8-dp3A8okjLBM272tUur97eKb0O_T8fxIvQm32tscfn-zW85iVcO3-zp8mcGr9FTIPupcrP459AyEKz7ylyNxuH7jioF-7euq0mhqcPuJmy5W24FmCXzYXga1-83vBGFA-jyChY.3VocG-LYOiLIBouyLttNmjc8pkvWBOrMFZ_Qr1DhcjQ&dib_tag=se&keywords=grandmother%2Bgift&qid=1758911778&sprefix=grandmother%2B%2Caps%2C103&sr=8-6&th=1',
    expected: 'B0CB8D7MZC',
    description: 'Complex URL that was failing'
  },
  {
    url: 'https://www.amazon.com/dp/B09376B4LP',
    expected: 'B09376B4LP',
    description: 'Standard Amazon URL'
  },
  {
    url: 'B09376B4LP',
    expected: 'B09376B4LP',
    description: 'Standalone ASIN'
  },
  {
    url: 'https://amazon.com/dp/B09376B4LP/ref=sr_1_1?keywords=test',
    expected: 'B09376B4LP',
    description: 'URL with parameters'
  },
  {
    url: 'https://www.google.com',
    expected: 'INVALID',
    description: 'Non-Amazon URL (should fail)'
  }
];

console.log('🔍 COMPREHENSIVE AUDIT: Amazon URL Parsing');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

testUrls.forEach((test, index) => {
  try {
    const result = parseAsinOrUrl(test.url);
    const success = (test.expected === 'INVALID' && !result.isValid) || 
                    (result.isValid && result.parsedValue === test.expected);
    
    console.log(`${index + 1}. ${test.description}`);
    console.log(`   URL: ${test.url.substring(0, 60)}${test.url.length > 60 ? '...' : ''}`);
    console.log(`   Expected: ${test.expected || 'INVALID'}`);
    console.log(`   Result: ${result.isValid ? '✅ VALID' : '❌ INVALID'}`);
    if (result.isValid) {
      console.log(`   Extracted ASIN: ${result.parsedValue}`);
    } else {
      console.log(`   Error: ${result.error}`);
    }
    console.log(`   Status: ${success ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');
    
    if (success) {
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    console.log(`${index + 1}. ${test.description}`);
    console.log(`   ERROR: ${error.message}`);
    console.log(`   Status: ❌ FAIL`);
    console.log('');
    failed++;
  }
});

console.log('='.repeat(60));
console.log(`📊 Audit Results: ${passed} passed, ${failed} failed`);
console.log(`Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

if (failed === 0) {
  console.log('🎉 ALL TESTS PASSED! Amazon URL parsing is working correctly.');
} else {
  console.log('⚠️  Some tests failed. Review the issues above.');
}

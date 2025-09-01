import { NextRequest, NextResponse } from 'next/server';
import { analyzeExistingSeller } from '@/lib/ai';

export async function GET(request: NextRequest) {
  try {
    // Test with sample data
    const testData = {
      asin: 'B08N5WRWNW',
      keywords: ['wireless earbuds', 'bluetooth headphones'],
      fulfilment: 'FBA' as const,
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890'
    };

    console.log('Testing AI analysis...');
    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
    
    const result = await analyzeExistingSeller(testData);
    
    console.log('AI Result:', result);

    return NextResponse.json({
      success: true,
      result,
      hasApiKey: !!process.env.OPENAI_API_KEY
    });

  } catch (error) {
    console.error('AI Test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      hasApiKey: !!process.env.OPENAI_API_KEY
    }, { status: 500 });
  }
}

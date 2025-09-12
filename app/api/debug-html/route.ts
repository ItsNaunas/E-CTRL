import { NextRequest, NextResponse } from 'next/server';
import { debugHTMLStructure } from '../../../lib/debug-html-structure';

export async function POST(request: NextRequest) {
  try {
    const { asin } = await request.json();
    
    if (!asin) {
      return NextResponse.json({ error: 'ASIN is required' }, { status: 400 });
    }

    console.log(`🔍 Debug HTML API called with ASIN: ${asin}`);
    const result = await debugHTMLStructure(asin);
    
    return NextResponse.json({
      success: true,
      message: 'HTML structure analysis completed. Check server logs for details.'
    });

  } catch (error) {
    console.error('Debug HTML API error:', error);
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

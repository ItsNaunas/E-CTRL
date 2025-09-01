import { NextRequest, NextResponse } from 'next/server';
import { suggestKeywords, suggestTitle } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data' },
        { status: 400 }
      );
    }

    let result;

    if (type === 'keywords') {
      const { category, description } = data;
      if (!category || !description) {
        return NextResponse.json(
          { error: 'Category and description required for keyword suggestions' },
          { status: 400 }
        );
      }
      
      result = await suggestKeywords(category, description);
    } else if (type === 'title') {
      const { category, description, keywords } = data;
      if (!category || !description) {
        return NextResponse.json(
          { error: 'Category and description required for title suggestions' },
          { status: 400 }
        );
      }
      
      result = await suggestTitle(category, description, keywords || []);
    } else {
      return NextResponse.json(
        { error: 'Invalid suggestion type' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      suggestions: result
    });

  } catch (error) {
    console.error('Suggestions API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}

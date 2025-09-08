import { NextRequest, NextResponse } from 'next/server';
import { analyzeNewSeller } from '@/lib/ai';
import { scrapeProductPage } from '@/lib/product-scraper';
import { newSellerSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type !== 'new_seller') {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request type' 
      }, { status: 400 });
    }

    // Validate the data
    const validatedData = newSellerSchema.parse(data);
    
    // For new sellers, try to scrape product data if website URL is provided
    let productData = undefined;
    
    if (validatedData.websiteUrl) {
      console.log('Scraping product data for preview:', validatedData.websiteUrl);
      const scrapedData = await scrapeProductPage(validatedData.websiteUrl);
      
      if ('error' in scrapedData) {
        console.warn('Product scraping failed for preview:', scrapedData.error);
      } else {
        console.log('Successfully scraped product data for preview');
        productData = scrapedData;
      }
    } else {
      console.log('No website URL provided for preview, using user data only');
    }
    
    // Generate AI analysis WITHOUT creating database entries
    const aiResult = await analyzeNewSeller(validatedData, productData);
    
    if (!aiResult) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to generate analysis' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      aiResult: aiResult
    });

  } catch (error) {
    console.error('Preview API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

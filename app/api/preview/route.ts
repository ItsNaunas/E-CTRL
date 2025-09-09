import { NextRequest, NextResponse } from 'next/server';
import { analyzeNewSeller, analyzeExistingSeller } from '@/lib/ai';
import { scrapeProductPage } from '@/lib/product-scraper';
import { scrapeProduct } from '@/lib/amazon-scraper';
import { newSellerSchema, existingSellerSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type !== 'new_seller' && type !== 'existing_seller') {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request type' 
      }, { status: 400 });
    }

    // Validate the data based on type
    let validatedData;
    if (type === 'new_seller') {
      validatedData = newSellerSchema.parse(data);
    } else {
      validatedData = existingSellerSchema.parse(data);
    }
    
    // Scrape product data based on type
    let productData = undefined;
    
    if (type === 'new_seller' && validatedData.websiteUrl) {
      console.log('Scraping product data for new seller preview:', validatedData.websiteUrl);
      const scrapedData = await scrapeProductPage(validatedData.websiteUrl);
      
      if ('error' in scrapedData) {
        console.warn('Product scraping failed for preview:', scrapedData.error);
      } else {
        console.log('Successfully scraped product data for preview');
        productData = scrapedData;
      }
    } else if (type === 'existing_seller' && validatedData.asin) {
      console.log('Scraping Amazon product data for existing seller preview:', validatedData.asin);
      const scrapedData = await scrapeProduct(validatedData.asin);
      
      if ('error' in scrapedData) {
        console.warn('Amazon scraping failed for preview:', scrapedData.error);
      } else {
        console.log('Successfully scraped Amazon product data for preview');
        productData = scrapedData;
      }
    } else {
      console.log('No product data available for preview, using user data only');
    }
    
    // Generate AI analysis WITHOUT creating database entries
    let aiResult;
    if (type === 'new_seller') {
      aiResult = await analyzeNewSeller(validatedData, productData);
    } else {
      aiResult = await analyzeExistingSeller(validatedData, productData);
    }
    
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

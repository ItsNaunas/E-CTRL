import { NextRequest, NextResponse } from 'next/server';
import { analyzeNewSeller, analyzeExistingSeller } from '@/lib/ai';
import { scrapeProductPage } from '@/lib/product-scraper';
import { scrapeProduct } from '@/lib/amazon-scraper';
import { newSellerSchema, existingSellerSchema } from '@/lib/validation';
import { AUDIT_TYPES } from '@/lib/constants';
import { checkOperationRateLimit, recordOperation } from '@/lib/rate-limiting';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type !== AUDIT_TYPES.NEW_SELLER && type !== AUDIT_TYPES.EXISTING_SELLER) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request type' 
      }, { status: 400 });
    }

    // Validate the data based on type
    let validatedData;
    if (type === AUDIT_TYPES.NEW_SELLER) {
      validatedData = newSellerSchema.parse(data);
    } else {
      validatedData = existingSellerSchema.parse(data);
    }

    // Determine access type by checking if user has an account
    let accessType: 'guest' | 'account' = 'guest';
    try {
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', validatedData.email)
        .single();
      
      if (existingUser) {
        accessType = 'account';
      }
    } catch (error) {
      // No existing user found, remain as guest
    }

    // Check rate limit for preview operations
    const rateLimitResult = await checkOperationRateLimit(
      validatedData.email, 
      'preview', 
      accessType,
      type === AUDIT_TYPES.EXISTING_SELLER ? validatedData.asin : undefined
    );

    if (!rateLimitResult.allowed) {
      return NextResponse.json({ 
        success: false, 
        error: rateLimitResult.message,
        resetTime: rateLimitResult.resetTime,
        remaining: rateLimitResult.remaining
      }, { status: 429 });
    }
    
    // Scrape product data based on type
    let productData = undefined;
    
    if (type === AUDIT_TYPES.NEW_SELLER && 'websiteUrl' in validatedData && validatedData.websiteUrl) {
      console.log('Scraping product data for new seller preview:', validatedData.websiteUrl);
      const scrapedData = await scrapeProductPage(validatedData.websiteUrl);
      
      if ('error' in scrapedData) {
        console.warn('Product scraping failed for preview:', scrapedData.error);
        // Return specific error for URL scraping failure to redirect to manual input
        return NextResponse.json({ 
          success: false, 
          error: 'Unable to scrape product data from this URL',
          code: 'URL_SCRAPING_FAILED',
          message: 'Please use the manual input form instead to create your Amazon listing.',
          suggestion: 'manual_input'
        }, { status: 400 });
      } else {
        console.log('Successfully scraped product data for preview');
        productData = scrapedData;
      }
    } else if (type === AUDIT_TYPES.EXISTING_SELLER && 'asin' in validatedData && validatedData.asin) {
      console.log('Scraping Amazon product data for existing seller preview:', validatedData.asin);
      const scrapedData = await scrapeProduct(validatedData.asin);
      
      if ('error' in scrapedData) {
        console.warn('Amazon scraping failed for preview:', scrapedData.error);
        
        // Return specific error for invalid ASINs instead of continuing
        if (scrapedData.code === 'INVALID_INPUT' || scrapedData.code === 'INVALID_ASIN') {
          return NextResponse.json({ 
            success: false, 
            error: 'Invalid ASIN provided. Please enter a valid 10-character ASIN or Amazon product URL.',
            code: scrapedData.code
          }, { status: 400 });
        }
        
        if (scrapedData.code === 'PRODUCT_NOT_FOUND') {
          return NextResponse.json({ 
            success: false, 
            error: 'Product not found. Please check the ASIN and try again.',
            code: scrapedData.code
          }, { status: 404 });
        }
        
        // For other scraping errors, continue with limited data
      } else {
        console.log('Successfully scraped Amazon product data for preview');
        productData = scrapedData;
      }
    } else {
      console.log('No product data available for preview, using user data only');
    }
    
    // Generate AI analysis WITHOUT creating database entries
    let aiResult;
    if (type === AUDIT_TYPES.NEW_SELLER) {
      aiResult = await analyzeNewSeller(validatedData as any, productData as any);
    } else {
      aiResult = await analyzeExistingSeller(validatedData as any, productData as any);
    }
    
    if (!aiResult) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to generate analysis' 
      }, { status: 500 });
    }

    // Record successful operation for analytics
    await recordOperation(
      validatedData.email,
      'preview',
      accessType,
      {
        type,
        asin: type === AUDIT_TYPES.EXISTING_SELLER ? validatedData.asin : undefined,
        hasProductData: !!productData,
        timestamp: new Date().toISOString()
      }
    );

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

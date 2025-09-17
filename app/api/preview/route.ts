import { NextRequest, NextResponse } from 'next/server';
import { analyzeNewSeller, analyzeExistingSeller } from '@/lib/ai';
import { scrapeProductPage } from '@/lib/product-scraper';
import { scrapeProduct } from '@/lib/amazon-scraper';
import { newSellerSchema, existingSellerSchema } from '@/lib/validation';
import { AUDIT_TYPES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, checkOnly = false } = body;

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

    // Simple bot detection - minimal abuse prevention
    const userAgent = request.headers.get('user-agent');
    if (!userAgent || userAgent.toLowerCase().includes('bot')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please use a web browser' 
      }, { status: 403 });
    }
    
    // Scrape product data based on type
    let productData = undefined;
    
    if (type === AUDIT_TYPES.NEW_SELLER && 'websiteUrl' in validatedData && validatedData.websiteUrl) {
      console.log('Scraping product data for new seller preview:', validatedData.websiteUrl);
      
      try {
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
      } catch (scrapingError) {
        console.error('Scraping function threw an exception:', scrapingError);
        // Handle any exceptions thrown by the scraping function
        return NextResponse.json({ 
          success: false, 
          error: 'Unable to scrape product data from this URL',
          code: 'URL_SCRAPING_FAILED',
          message: 'Please use the manual input form instead to create your Amazon listing.',
          suggestion: 'manual_input'
        }, { status: 400 });
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
    
    // If checkOnly is true, just return success without AI analysis
    if (checkOnly) {
      return NextResponse.json({
        success: true,
        scannable: true,
        message: 'URL is scannable'
      });
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

    // Log for monitoring (no rate limiting)
    const logData: any = {
      type,
      hasProductData: !!productData,
      timestamp: new Date().toISOString(),
      estimatedCost: 0.10
    };
    
    // Add ASIN only for existing seller audits
    if (type === AUDIT_TYPES.EXISTING_SELLER && 'asin' in validatedData) {
      logData.asin = validatedData.asin;
    }
    
    console.log('Preview analysis completed:', logData);

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

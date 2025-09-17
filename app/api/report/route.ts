import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  existingSellerSchema, 
  newSellerSchema,
  type ExistingSellerData,
  type NewSellerData 
} from '@/lib/validation';
import { 
  createLead, 
  createAuditReport, 
  trackEvent 
} from '@/lib/database';
import { analyzeExistingSeller, analyzeNewSeller } from '@/lib/ai';
import { sendWelcomeEmail } from '@/lib/email';
import { scrapeProduct } from '@/lib/amazon-scraper';
import { scrapeProductPage, type GenericProductData } from '@/lib/product-scraper';
import { AUDIT_TYPES } from '@/lib/constants';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, checkOnly } = body;

    // Validate request structure
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data' },
        { status: 400 }
      );
    }

    // Validate form data based on type first
    let validatedData: ExistingSellerData | NewSellerData;
    
    if (type === AUDIT_TYPES.EXISTING_SELLER) {
      validatedData = existingSellerSchema.parse(data);
    } else if (type === AUDIT_TYPES.NEW_SELLER) {
      validatedData = newSellerSchema.parse(data);
    } else {
      return NextResponse.json(
        { error: 'Invalid audit type' },
        { status: 400 }
      );
    }

    // Simple bot detection
    const userAgent = request.headers.get('user-agent');
    if (!userAgent || userAgent.toLowerCase().includes('bot')) {
      return NextResponse.json(
        { error: 'Please use a web browser' },
        { status: 403 }
      );
    }

    // Determine access type by checking if user already has an account
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

    // Create lead in database
    const lead = await createLead(validatedData, type, request.headers);
    if (!lead) {
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      );
    }

    // Track form submission event
    await trackEvent('form_submit', { audit_type: type }, undefined, lead.id, request.headers);

    // Generate AI-powered audit results
    console.log('Starting AI analysis for type:', type);
    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
    
    // If user has account, link the lead to them (with error handling)
    if (accessType === 'account') {
      try {
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', validatedData.email)
          .single();
        
        if (existingUser) {
          // Update the lead to link it to the existing user
          const { error: linkError } = await supabaseAdmin
            .from('leads')
            .update({ user_id: existingUser.id, updated_at: new Date().toISOString() })
            .eq('id', lead.id);
          
          if (linkError) {
            console.error('Failed to link lead to user:', linkError);
            // Don't fail the entire operation, just log the error
          }
        }
      } catch (linkError) {
        console.error('Error linking lead to account user:', linkError);
        // Continue with report generation even if linking fails
      }
    }
    
    let aiResult;
    if (type === AUDIT_TYPES.EXISTING_SELLER) {
      // Scrape Amazon product data first
      console.log('Scraping Amazon product data for ASIN:', (validatedData as ExistingSellerData).asin);
      const productData = await scrapeProduct((validatedData as ExistingSellerData).asin);
      
      if ('error' in productData) {
        console.warn('Scraping failed, proceeding with limited data:', productData.error);
        aiResult = await analyzeExistingSeller(validatedData as ExistingSellerData, undefined, accessType);
      } else {
        console.log('Successfully scraped product data, analyzing with real data');
        aiResult = await analyzeExistingSeller(validatedData as ExistingSellerData, productData, accessType);
      }
    } else {
      // For new sellers, try to scrape product data if website URL is provided
      let productData: GenericProductData | undefined = undefined;
      const newSellerData = validatedData as NewSellerData;
      
      if (newSellerData.websiteUrl) {
        console.log('Scraping product data for new seller website:', newSellerData.websiteUrl);
        
        try {
          const scrapedData = await scrapeProductPage(newSellerData.websiteUrl);
          
          if ('error' in scrapedData) {
            console.warn('Product scraping failed for new seller:', scrapedData.error);
            // Return specific error for URL scraping failure to be consistent with preview API
            return NextResponse.json({ 
              success: false, 
              error: 'Unable to scrape product data from this URL',
              code: 'URL_SCRAPING_FAILED',
              message: 'Please use the manual input form instead to create your Amazon listing.',
              suggestion: 'manual_input'
            }, { status: 400 });
          } else if (checkOnly) {
            // If checkOnly is true, just return success without AI analysis
            return NextResponse.json({
              success: true,
              scannable: true,
              message: 'URL is scannable'
            });
          } else {
            console.log('Successfully scraped product data for new seller');
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
      } else {
        console.log('No website URL provided, using user-provided data only');
      }
      
      aiResult = await analyzeNewSeller(newSellerData, productData, accessType);
    }

    console.log('AI Result:', aiResult);
    console.log('AI Result type:', typeof aiResult);
    console.log('AI Result keys:', aiResult ? Object.keys(aiResult) : 'null');

    // If AI fails, return error instead of mock data
    if (!aiResult) {
      console.error('AI analysis failed completely');
      return NextResponse.json(
        { error: 'AI analysis failed. Please try again later.' },
        { status: 500 }
      );
    }

    // Create report in database with access type
    const report = await createAuditReport(
      lead.id,
      aiResult.score,
      aiResult.highlights,
      aiResult.recommendations,
      aiResult.detailedAnalysis,
      accessType === 'account' ? lead.user_id : undefined,
      accessType
    );

    if (!report) {
      return NextResponse.json(
        { error: 'Failed to create report' },
        { status: 500 }
      );
    }

    // Track report generation event
    await trackEvent('report_generated', { report_id: report.id }, undefined, lead.id, request.headers);

    // Send welcome email to the user with PDF data
    try {
        // Handle both old and new AI result structures
        let emailData;
        if (aiResult.idqAnalysis) {
          // New IDQ structure
          emailData = {
            to: validatedData.email,
            name: validatedData.name || 'there',
            mode: (type === AUDIT_TYPES.EXISTING_SELLER ? 'audit' : 'create') as 'audit' | 'create',
            accessType: accessType,
            // PDF generation data - convert IDQ structure
            score: aiResult.binaryIdqResult?.qualityPercent || 0, // Use binary IDQ score
            highlights: aiResult.summary?.keyImprovements || [],
            recommendations: aiResult.summary?.nextSteps || [],
            detailedAnalysis: {
              idqAnalysis: aiResult.idqAnalysis,
              summary: aiResult.summary,
              binaryIdqResult: aiResult.binaryIdqResult // Include binary results in PDF
            },
            // Type-safe property access
            asin: type === AUDIT_TYPES.EXISTING_SELLER ? (validatedData as ExistingSellerData).asin : undefined,
            productUrl: type === AUDIT_TYPES.NEW_SELLER ? (validatedData as NewSellerData).websiteUrl : undefined,
            keywords: validatedData.keywords,
            fulfilment: type === AUDIT_TYPES.EXISTING_SELLER ? (validatedData as ExistingSellerData).fulfilment : undefined,
            category: type === AUDIT_TYPES.NEW_SELLER ? (validatedData as NewSellerData).category : undefined,
            productDesc: type === AUDIT_TYPES.NEW_SELLER ? (validatedData as NewSellerData).desc : undefined
          };
        } else {
          // Old structure (for existing sellers)
          emailData = {
            to: validatedData.email,
            name: validatedData.name || 'there',
            mode: (type === AUDIT_TYPES.EXISTING_SELLER ? 'audit' : 'create') as 'audit' | 'create',
            accessType: accessType,
            // PDF generation data
            score: aiResult.binaryIdqResult?.qualityPercent || aiResult.score, // Use binary IDQ score if available
            highlights: aiResult.highlights,
            recommendations: aiResult.recommendations,
            detailedAnalysis: {
              ...aiResult.detailedAnalysis,
              binaryIdqResult: aiResult.binaryIdqResult // Include binary results in PDF
            },
            // Type-safe property access
            asin: type === AUDIT_TYPES.EXISTING_SELLER ? (validatedData as ExistingSellerData).asin : undefined,
            productUrl: type === AUDIT_TYPES.NEW_SELLER ? (validatedData as NewSellerData).websiteUrl : undefined,
            keywords: validatedData.keywords,
            fulfilment: type === AUDIT_TYPES.EXISTING_SELLER ? (validatedData as ExistingSellerData).fulfilment : undefined,
            category: type === AUDIT_TYPES.NEW_SELLER ? (validatedData as NewSellerData).category : undefined,
            productDesc: type === AUDIT_TYPES.NEW_SELLER ? (validatedData as NewSellerData).desc : undefined
          };
        }


      const emailResult = await sendWelcomeEmail(emailData);

      if (emailResult.success) {
        console.log('Welcome email sent successfully:', emailResult.messageId);
      } else {
        console.error('Failed to send welcome email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the whole request if email fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      reportId: report.id,
      leadId: lead.id,
      result: aiResult
    });

  } catch (error) {
    console.error('Report API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  existingSellerSchema, 
  newSellerSchema,
  type ExistingSellerData,
  type NewSellerData 
} from '@/lib/validation';
import { 
  checkRateLimit, 
  createLead, 
  createAuditReport, 
  trackEvent 
} from '@/lib/database';
import { analyzeExistingSeller, analyzeNewSeller } from '@/lib/ai';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Validate request structure
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data' },
        { status: 400 }
      );
    }

    // Check rate limit first
    const rateLimitAllowed = await checkRateLimit(data.email, type);
    if (!rateLimitAllowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. One report per email per day.' },
        { status: 429 }
      );
    }

    // Validate form data based on type
    let validatedData: ExistingSellerData | NewSellerData;
    
    if (type === 'existing_seller') {
      validatedData = existingSellerSchema.parse(data);
    } else if (type === 'new_seller') {
      validatedData = newSellerSchema.parse(data);
    } else {
      return NextResponse.json(
        { error: 'Invalid audit type' },
        { status: 400 }
      );
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
    
    let aiResult;
    if (type === 'existing_seller') {
      aiResult = await analyzeExistingSeller(validatedData as ExistingSellerData);
    } else {
      aiResult = await analyzeNewSeller(validatedData as NewSellerData);
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

    // Create report in database
    const report = await createAuditReport(
      lead.id,
      aiResult.score,
      aiResult.highlights,
      aiResult.recommendations,
      aiResult.detailedAnalysis
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
      const emailResult = await sendWelcomeEmail({
        to: validatedData.email,
        name: validatedData.name || 'there',
        mode: type === 'existing_seller' ? 'audit' : 'create',
        // PDF generation data
        score: aiResult.score,
        highlights: aiResult.highlights,
        recommendations: aiResult.recommendations,
        detailedAnalysis: aiResult.detailedAnalysis,
        // Type-safe property access
        asin: type === 'existing_seller' ? (validatedData as ExistingSellerData).asin : undefined,
        productUrl: type === 'new_seller' ? (validatedData as NewSellerData).websiteUrl : undefined,
        keywords: validatedData.keywords,
        fulfilment: type === 'existing_seller' ? (validatedData as ExistingSellerData).fulfilment : undefined,
        category: type === 'new_seller' ? (validatedData as NewSellerData).category : undefined,
        productDesc: type === 'new_seller' ? (validatedData as NewSellerData).desc : undefined
      });

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

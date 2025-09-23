import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateLeadEmail, getReportsByEmail } from '@/lib/database';
import { sendWelcomeEmail } from '@/lib/email';
import type { ReportWithLead } from '@/lib/supabase';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required'),
  leadId: z.string().uuid('Invalid lead ID'),
  mode: z.enum(['audit', 'create']).default('audit').transform(val => val as 'audit' | 'create'),
});

type EmailSchemaType = z.infer<typeof emailSchema>;

// Type guard for mode
function isValidMode(mode: string): mode is 'audit' | 'create' {
  return mode === 'audit' || mode === 'create';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Email API received:', body);
    
    const validatedData: EmailSchemaType = emailSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Update the lead with the email information
    const updated = await updateLeadEmail(
      validatedData.leadId,
      validatedData.email,
      validatedData.name
    );
    
    console.log('Update result:', updated);

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update lead' },
        { status: 500 }
      );
    }

    // Get the latest report data for this email to include PDF
    let pdfData = null;
    
    console.log('Retrieving latest report data for email:', validatedData.email);
    const reports = await getReportsByEmail(validatedData.email);
    
    if (reports && reports.length > 0) {
      const latestReport: ReportWithLead = reports[0];
      console.log('Found latest report:', latestReport.id);
      
      // Extract analysis data for PDF generation - include full AI analysis data
      pdfData = {
        name: latestReport.leads?.name || validatedData.name,
        email: validatedData.email,
        mode: latestReport.leads?.audit_type === 'existing_seller' ? 'audit' : 'create',
        score: latestReport.score,
        highlights: latestReport.highlights || [],
        recommendations: latestReport.recommendations || [],
        detailedAnalysis: latestReport.detailed_analysis || {},
        // Pass through the complete AI analysis data structure
        idqAnalysis: latestReport.detailed_analysis?.idqAnalysis,
        summary: latestReport.detailed_analysis?.summary,
        productData: latestReport.detailed_analysis?.productData,
        contentQuality: latestReport.detailed_analysis?.contentQuality,
        binaryIdqResult: latestReport.detailed_analysis?.binaryIdqResult,
        asin: latestReport.leads?.asin || undefined,
        productUrl: latestReport.leads?.website_url || undefined,
        keywords: latestReport.leads?.keywords || [],
        fulfilment: latestReport.leads?.fulfilment || undefined,
        category: latestReport.leads?.category || undefined,
        productDesc: latestReport.leads?.product_desc || undefined
      };
      
      console.log('Database PDF data extracted:', {
        hasScore: pdfData.score !== null,
        hasHighlights: pdfData.highlights.length > 0,
        hasRecommendations: pdfData.recommendations.length > 0,
        hasDetailedAnalysis: !!pdfData.detailedAnalysis
      });
    } else {
      console.log('No reports found for email:', validatedData.email);
      console.log('User will receive welcome email without PDF');
    }

    // Send welcome email with PDF data if available
    const emailResult = await sendWelcomeEmail({
      to: validatedData.email,
      name: validatedData.name,
      // Include PDF data if available
      ...(pdfData || {}),
      mode: validatedData.mode as 'audit' | 'create' // Zod validates this is one of these values
    });

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      // Don't fail the whole request if email fails
      console.warn('Email sending failed, but lead was updated successfully');
    } else {
      console.log('Welcome email sent successfully:', emailResult.messageId);
    }

    return NextResponse.json({
      success: true,
      message: 'Email submitted successfully and welcome email sent!',
      messageId: emailResult.success ? emailResult.messageId : null,
      hasPdf: !!pdfData
    });

  } catch (error) {
    console.error('Email API error:', error);
    
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

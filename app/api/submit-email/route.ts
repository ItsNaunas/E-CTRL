import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';
import { getReportsByEmail } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, name, mode } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    console.log('Email submission received:', { email, name, mode });
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY?.length);
    console.log('RESEND_API_KEY starts with:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');

    // Get the latest report data for this email to include PDF
    console.log('Retrieving latest report data for email:', email);
    const reports = await getReportsByEmail(email);
    
    let pdfData = null;
    if (reports && reports.length > 0) {
      const latestReport = reports[0];
      console.log('Found latest report:', latestReport.id);
      
      // Extract analysis data for PDF generation
      pdfData = {
        score: latestReport.score,
        highlights: latestReport.highlights || [],
        recommendations: latestReport.recommendations || [],
        detailedAnalysis: latestReport.detailed_analysis || {},
        asin: latestReport.leads?.asin || undefined,
        productUrl: latestReport.leads?.website_url || undefined,
        keywords: latestReport.leads?.keywords || [],
        fulfilment: latestReport.leads?.fulfilment || undefined,
        category: latestReport.leads?.category || undefined,
        productDesc: latestReport.leads?.desc || undefined
      };
      
      console.log('PDF data extracted:', {
        hasScore: pdfData.score !== null,
        hasHighlights: pdfData.highlights.length > 0,
        hasRecommendations: pdfData.recommendations.length > 0,
        hasDetailedAnalysis: !!pdfData.detailedAnalysis
      });
    } else {
      console.log('No reports found for email:', email);
    }

    // Send welcome email using Resend with PDF data
    console.log('About to call sendWelcomeEmail...');
    const emailResult = await sendWelcomeEmail({
      to: email,
      name: name || 'there',
      mode: mode || 'audit',
      // Include PDF data if available
      ...(pdfData || {})
    });
    console.log('sendWelcomeEmail result:', emailResult);

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      // Return the actual error so we can debug
      return NextResponse.json(
        { 
          success: false, 
          error: emailResult.error,
          email,
          mode
        },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', emailResult.messageId);

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Email submitted successfully and welcome email sent!',
        email,
        mode,
        messageId: emailResult.messageId,
        hasPdf: !!pdfData
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email submission error:', error);
    console.error('Error type:', typeof error);
    
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('Error message:', errorMessage);
    console.error('Error stack:', errorStack);
    
    return NextResponse.json(
      { 
        error: 'Failed to submit email. Please try again.',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

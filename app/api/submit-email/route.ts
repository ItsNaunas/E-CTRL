import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';
import { getReportsByEmail, updateLeadEmail } from '@/lib/database';
import type { ReportWithLead } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, name, mode, leadId, previewData } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    console.log('Email submission received:', { email, mode, leadId, hasPreviewData: !!previewData });

    // If leadId is provided, update the existing lead with the user's email
    if (leadId) {
      console.log('Updating lead with user email:', leadId, email);
      const updatedLead = await updateLeadEmail(leadId, email, name || 'User');
      if (updatedLead) {
        console.log('Lead updated successfully:', updatedLead.id);
      } else {
        console.error('Failed to update lead');
      }
    } else {
      console.log('No leadId provided - this is a preview-to-full conversion');
    }

    // Get the latest report data for this email to include PDF
    let pdfData = null;
    
    // If we have preview data (from homepage preview flow), use that
    if (previewData) {
      console.log('Using preview data for PDF generation');
      pdfData = {
        name: name || 'User',
        email: email,
        mode: mode || 'audit',
        score: previewData.score || 0,
        highlights: previewData.highlights || [],
        recommendations: previewData.recommendations || [],
        detailedAnalysis: previewData.detailedAnalysis || {},
        // Pass through the complete AI analysis data structure
        idqAnalysis: previewData.detailedAnalysis?.idqAnalysis,
        summary: previewData.detailedAnalysis?.summary,
        productData: previewData.detailedAnalysis?.productData,
        contentQuality: previewData.detailedAnalysis?.contentQuality,
        binaryIdqResult: previewData.detailedAnalysis?.binaryIdqResult,
        asin: previewData.asin || undefined,
        productUrl: previewData.productUrl || undefined,
        keywords: previewData.keywords || [],
        fulfilment: previewData.fulfilment || undefined,
        category: previewData.category || undefined,
        productDesc: previewData.productDesc || undefined
      };
      
      console.log('Preview PDF data extracted:', {
        hasScore: pdfData.score !== null,
        hasHighlights: pdfData.highlights.length > 0,
        hasRecommendations: pdfData.recommendations.length > 0,
        hasDetailedAnalysis: !!pdfData.detailedAnalysis,
        asin: pdfData.asin,
        productUrl: pdfData.productUrl
      });
    } else {
      // Fallback to database lookup for tool page submissions
      console.log('Retrieving latest report data for email:', email);
      const reports = await getReportsByEmail(email);
      
      if (reports && reports.length > 0) {
        const latestReport: ReportWithLead = reports[0];
        console.log('Found latest report:', latestReport.id);
        
        // Extract analysis data for PDF generation - include full AI analysis data
        pdfData = {
          name: latestReport.leads?.name || name || 'User',
          email: email,
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
        console.log('No reports found for email:', email);
        console.log('User will receive welcome email without PDF');
      }
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

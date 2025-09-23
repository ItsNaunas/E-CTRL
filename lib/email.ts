import { Resend } from 'resend';
import { generateAuditReportPDF, generateListingPackPDF, getPDFBlob, type PDFData } from './pdf';
import { env, validateRequiredEnv, EnvironmentError } from './env';

// Initialize Resend client lazily with proper validation
function getResendClient() {
  try {
    validateRequiredEnv('api');
    const apiKey = env.resend();
    // API key validation completed
    
    return new Resend(apiKey);
  } catch (error) {
    console.error('Failed to initialize Resend client:', error);
    throw new EnvironmentError('Email service not configured properly');
  }
}

export interface EmailData {
  to: string;
  name: string;
  mode: 'audit' | 'create';
  accessType?: 'guest' | 'account';
  reportUrl?: string;
  // PDF generation data
  score?: number;
  highlights?: string[];
  recommendations?: string[];
  detailedAnalysis?: any;
  // New seller specific data
  idqAnalysis?: {
    title?: { current?: string; issues?: string[]; optimised?: string };
    bullets?: { current?: string[]; issues?: string[]; optimised?: string[] };
    description?: { current?: string; issues?: string[]; optimised?: string };
    keywords?: { current?: string[]; issues?: string[]; optimised?: { primary?: string[]; secondary?: string[]; longTail?: string[] } };
    images?: { current?: string[]; issues?: string[]; required?: { mainImage?: string; lifestyleImage?: string; benefitsInfographic?: string; howToUse?: string; measurements?: string; comparison?: string } };
    compliance?: { current?: string; issues?: string[]; requirements?: string[] };
  };
  summary?: {
    overallReadiness?: string;
    keyImprovements?: string[];
    nextSteps?: string[];
  };
  // Existing seller specific data
  productData?: {
    currentTitle?: string;
    currentBullets?: string[];
    currentImages?: number;
    currentDescription?: string;
    missingElements?: string[];
  };
  contentQuality?: {
    titleScore?: number;
    bulletsScore?: number;
    imagesScore?: number;
    descriptionScore?: number;
    informationScore?: number;
  };
  binaryIdqResult?: any;
  asin?: string;
  productUrl?: string;
  keywords?: string[];
  fulfilment?: string;
  category?: string;
  productDesc?: string;
}

export async function sendWelcomeEmail(data: EmailData) {
  try {
    console.log('=== sendWelcomeEmail START ===');
    
    // Environment validation is now handled in getResendClient()
    console.log('Attempting to send email to:', data.to);
    console.log('Email data received:', data);
    
    // Generate PDF if we have the data
    let pdfAttachment = null;
    if (data.score !== undefined || data.detailedAnalysis) {
      try {
        console.log('=== PDF GENERATION START ===');
        console.log('PDF Data received:', {
          hasScore: data.score !== undefined,
          hasHighlights: !!data.highlights,
          hasRecommendations: !!data.recommendations,
          hasDetailedAnalysis: !!data.detailedAnalysis,
          hasIdqAnalysis: !!data.idqAnalysis,
          hasSummary: !!data.summary,
          idqAnalysisKeys: data.idqAnalysis ? Object.keys(data.idqAnalysis) : [],
          summaryKeys: data.summary ? Object.keys(data.summary) : [],
          mode: data.mode,
          asin: data.asin,
          name: data.name,
          email: data.to
        });
        
        console.log('Calling PDF generation function for mode:', data.mode);
        
        // Use the appropriate PDF generation function based on mode
        const pdfDoc = data.mode === 'audit' 
          ? generateAuditReportPDF({
              name: data.name,
              email: data.to,
              mode: data.mode,
              accessType: data.accessType || 'guest',
              score: data.score,
              highlights: data.highlights,
              recommendations: data.recommendations,
              detailedAnalysis: data.detailedAnalysis,
              productData: data.productData,
              contentQuality: data.contentQuality,
              binaryIdqResult: data.binaryIdqResult,
              asin: data.asin,
              productUrl: data.productUrl,
              keywords: data.keywords,
              fulfilment: data.fulfilment,
              category: data.category,
              productDesc: data.productDesc
            })
          : generateListingPackPDF({
              name: data.name,
              email: data.to,
              mode: data.mode,
              accessType: data.accessType || 'guest',
              score: data.score,
              highlights: data.highlights,
              recommendations: data.recommendations,
              detailedAnalysis: data.detailedAnalysis,
              idqAnalysis: data.idqAnalysis,
              summary: data.summary,
              asin: data.asin,
              productUrl: data.productUrl,
              keywords: data.keywords,
              fulfilment: data.fulfilment,
              category: data.category,
              productDesc: data.productDesc
            });
        
        console.log('PDF document created successfully');
        
        console.log('Converting PDF to blob...');
        const pdfBlob = getPDFBlob(pdfDoc);
        console.log('PDF blob created, size:', pdfBlob.size, 'bytes');
        
        console.log('Converting blob to buffer...');
        const pdfBuffer = await pdfBlob.arrayBuffer();
        console.log('PDF buffer created, size:', pdfBuffer.byteLength, 'bytes');
        
        console.log('Converting buffer to base64...');
        const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
        console.log('PDF base64 created, length:', pdfBase64.length);
        
        pdfAttachment = {
          filename: data.mode === 'audit' 
            ? `amazon-audit-report-${data.asin || 'product'}.pdf`
            : 'amazon-listing-pack.pdf',
          content: pdfBase64,
          contentType: 'application/pdf'
        };
        
        console.log('PDF attachment created successfully');
        console.log('Attachment details:', {
          filename: pdfAttachment.filename,
          contentType: pdfAttachment.contentType,
          contentLength: pdfAttachment.content.length
        });
        console.log('=== PDF GENERATION SUCCESS ===');
      } catch (pdfError) {
        console.error('=== PDF GENERATION FAILED ===');
        console.error('PDF generation error:', pdfError);
        console.error('Error type:', typeof pdfError);
        console.error('Error message:', pdfError instanceof Error ? pdfError.message : String(pdfError));
        console.error('Error stack:', pdfError instanceof Error ? pdfError.stack : 'No stack trace');
        console.error('Data that caused the error:', {
          hasScore: data.score !== undefined,
          hasHighlights: !!data.highlights,
          hasRecommendations: !!data.recommendations,
          hasDetailedAnalysis: !!data.detailedAnalysis,
          mode: data.mode
        });
        // Continue without PDF if generation fails
      }
    } else {
      console.log('=== PDF GENERATION SKIPPED ===');
      console.log('No score or detailed analysis data available');
      console.log('Data received:', {
        score: data.score,
        hasDetailedAnalysis: !!data.detailedAnalysis,
        mode: data.mode
      });
    }
    
    // Use your verified domain with Cloudflare Email Routing
    const fromEmail = 'contact@e-ctrl.co.uk'; // Your professional domain email
    console.log('Using sender email:', fromEmail);
    console.log('Using verified domain with SPF/DKIM alignment');
    
    console.log('About to call resend.emails.send...');
    const emailData: any = {
      from: fromEmail,
      to: data.to,
      subject: data.mode === 'audit' 
        ? 'Your Amazon Audit Report is Ready!' 
        : 'Your Amazon Listing Pack is Ready!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; text-align: center;">E-CTRL</h1>
          <h2 style="color: #1f2937;">Hello ${data.name}!</h2>
          
          <p>Thank you for using E-CTRL, your Amazon optimisation partner!</p>
          
          ${data.mode === 'audit' ? `
            <h3 style="color: #059669;">Your Amazon Audit Report is Ready</h3>
            <p>We've analysed your Amazon listing and prepared a comprehensive audit report with:</p>
            <ul>
              <li>Detailed performance analysis</li>
              <li>Actionable optimisation recommendations</li>
              <li>Keyword strategy insights</li>
              <li>Competitive positioning analysis</li>
            </ul>
          ` : `
            <h3 style="color: #059669;">Your Amazon Listing Pack is Ready</h3>
            <p>We've created a complete listing pack to help you launch successfully on Amazon:</p>
            <ul>
              <li>Optimized product title</li>
              <li>Compelling bullet points</li>
              <li>Keyword strategy</li>
            <li>Listing optimisation recommendations</li>
            </ul>
          `}
          
          <p><strong>Your detailed report is attached to this email as a PDF!</strong></p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">What's Next?</h4>
            <ol>
              <li>Download and review the attached PDF report</li>
              <li>Review our recommendations</li>
              <li>Implement the suggested optimisations</li>
              <li>Watch your Amazon performance improve!</li>
            </ol>
          </div>

          <!-- Calendar Booking Section -->
          <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #296AFF 0%, #FF7D2B 100%); 
                      border-radius: 12px; text-align: center; color: white;">
            <h3 style="margin-bottom: 15px; font-size: 24px; color: white;">🚀 Ready to Scale Your Amazon Business?</h3>
            <p style="margin-bottom: 20px; font-size: 16px; color: white; opacity: 1;">
              Book a free 15-minute consultation with our Amazon expert to discuss your audit results and growth strategy.
            </p>
            <a href="https://calendly.com/fesalswork12/30min" 
               style="display: inline-block; background: white; color: #296AFF; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              📅 Book Free Consultation
            </a>
            <p style="margin-top: 15px; font-size: 14px; color: white; opacity: 1;">
              No strings attached • 15 minutes • Actionable insights
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            If you have any questions, feel free to reply to this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            © 2024 E-CTRL. All rights reserved.
          </p>
        </div>
      `
    };
    
    // Add PDF attachment if available
    if (pdfAttachment) {
      emailData.attachments = [pdfAttachment];
      console.log('=== PDF ATTACHMENT ADDED TO EMAIL ===');
      console.log('Attachment details:', {
        filename: pdfAttachment.filename,
        contentType: pdfAttachment.contentType,
        contentLength: pdfAttachment.content.length
      });
    } else {
      console.log('=== NO PDF ATTACHMENT ===');
      console.log('Email will be sent without PDF attachment');
    }
    
    const resend = getResendClient();
    const { data: result, error } = await resend.emails.send(emailData);

    console.log('Resend API response received');
    console.log('Result:', result);
    console.log('Error:', error);
    
    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully, messageId:', result?.id);
    return { success: true, messageId: result?.id };
  } catch (error) {
    console.error('=== sendWelcomeEmail ERROR ===');
    console.error('Email sending failed:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendReportEmail(data: EmailData & { reportUrl: string }) {
  try {
    // Use your verified domain with Cloudflare Email Routing
    const fromEmail = 'contact@e-ctrl.co.uk'; // Your professional domain email
    
    const resend = getResendClient();
    const { data: result, error } = await resend.emails.send({
      from: fromEmail,
      to: data.to,
      subject: `Your Complete ${data.mode === 'audit' ? 'Audit Report' : 'Listing Pack'} - E-CTRL`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; text-align: center;">E-CTRL</h1>
          <h2 style="color: #1f2937;">Your Report is Ready!</h2>
          
          <p>Hello ${data.name},</p>
          
          <p>Great news! Your ${data.mode === 'audit' ? 'Amazon audit report' : 'Amazon listing pack'} is ready for review.</p>
          
          <div style="background-color: #dbeafe; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <h3 style="color: #1e40af; margin-top: 0;">View Your Complete Report</h3>
            <a href="${data.reportUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Open Report Now
            </a>
          </div>
          
          <p>This report contains everything you need to optimize your Amazon presence and boost your sales.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Report Highlights:</h4>
            ${data.mode === 'audit' ? `
              <ul>
                <li>Comprehensive listing analysis</li>
                <li>Performance scoring and insights</li>
                <li>Keyword optimisation recommendations</li>
                <li>Image and content improvements</li>
                <li>Competitive positioning analysis</li>
              </ul>
            ` : `
              <ul>
                <li>Optimized product title</li>
                <li>Compelling bullet points</li>
                <li>Keyword strategy and research</li>
                <li>Listing optimisation recommendations</li>
                <li>Launch checklist and timeline</li>
              </ul>
            `}
          </div>
          
          <p><strong>Need help implementing these recommendations?</strong></p>

          <!-- Calendar Booking Section -->
          <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #296AFF 0%, #FF7D2B 100%); 
                      border-radius: 12px; text-align: center; color: white;">
            <h3 style="margin-bottom: 15px; font-size: 24px; color: white;">🚀 Ready to Scale Your Amazon Business?</h3>
            <p style="margin-bottom: 20px; font-size: 16px; color: white; opacity: 1;">
              Book a free 15-minute consultation with our Amazon expert to discuss your audit results and growth strategy.
            </p>
            <a href="https://calendly.com/fesalswork12/30min" 
               style="display: inline-block; background: white; color: #296AFF; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              📅 Book Free Consultation
            </a>
            <p style="margin-top: 15px; font-size: 14px; color: white; opacity: 1;">
              No strings attached • 15 minutes • Actionable insights
            </p>
          </div>
          <p>Our team is here to support you every step of the way.</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            © 2024 E-CTRL. All rights reserved.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: result?.id };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

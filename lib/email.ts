import { Resend } from 'resend';
import { generatePDF, getPDFBlob, type PDFData } from './pdf';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  name: string;
  mode: 'audit' | 'create';
  reportUrl?: string;
  // PDF generation data
  score?: number;
  highlights?: string[];
  recommendations?: string[];
  detailedAnalysis?: any;
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
    
    // Check if Resend API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return { success: false, error: 'Email service not configured' };
    }

    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY?.length);
    console.log('RESEND_API_KEY starts with:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');
    console.log('Attempting to send email to:', data.to);
    console.log('Email data received:', data);
    
    // Generate PDF if we have the data
    let pdfAttachment = null;
    if (data.score !== undefined || data.detailedAnalysis) {
      try {
        console.log('Generating PDF...');
        const pdfDoc = generatePDF({
          name: data.name,
          email: data.to,
          mode: data.mode,
          score: data.score,
          highlights: data.highlights,
          recommendations: data.recommendations,
          detailedAnalysis: data.detailedAnalysis,
          asin: data.asin,
          productUrl: data.productUrl,
          keywords: data.keywords,
          fulfilment: data.fulfilment,
          category: data.category,
          productDesc: data.productDesc
        });
        
        const pdfBlob = getPDFBlob(pdfDoc);
        const pdfBuffer = await pdfBlob.arrayBuffer();
        const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
        
        pdfAttachment = {
          filename: data.mode === 'audit' 
            ? `amazon-audit-report-${data.asin || 'product'}.pdf`
            : 'amazon-listing-pack.pdf',
          content: pdfBase64,
          contentType: 'application/pdf'
        };
        
        console.log('PDF generated successfully, size:', pdfBlob.size, 'bytes');
      } catch (pdfError) {
        console.error('PDF generation failed:', pdfError);
        // Continue without PDF if generation fails
      }
    }
    
    // Use a verified sender domain or the default Resend domain
    const fromEmail = 'onboarding@resend.dev'; // Use Resend's default verified domain
    console.log('Using sender email:', fromEmail);
    
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
          
          <p>Thank you for using E-CTRL, your Amazon optimization partner!</p>
          
          ${data.mode === 'audit' ? `
            <h3 style="color: #059669;">Your Amazon Audit Report is Ready</h3>
            <p>We've analyzed your Amazon listing and prepared a comprehensive audit report with:</p>
            <ul>
              <li>Detailed performance analysis</li>
              <li>Actionable optimization recommendations</li>
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
            <li>Image gallery recommendations</li>
            </ul>
          `}
          
          <p><strong>Your detailed report is attached to this email as a PDF!</strong></p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">What's Next?</h4>
            <ol>
              <li>Download and review the attached PDF report</li>
              <li>Review our recommendations</li>
              <li>Implement the suggested optimizations</li>
              <li>Watch your Amazon performance improve!</li>
            </ol>
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
      console.log('PDF attachment added to email');
    }
    
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
    // Use a verified sender domain or the default Resend domain
    const fromEmail = 'onboarding@resend.dev'; // Use Resend's default verified domain
    
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
            <h3 style="color: #1e40af; margin-top: 0;">📊 View Your Complete Report</h3>
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
                <li>Keyword optimization recommendations</li>
                <li>Image and content improvements</li>
                <li>Competitive positioning analysis</li>
              </ul>
            ` : `
              <ul>
                <li>Optimized product title</li>
                <li>Compelling bullet points</li>
                <li>Keyword strategy and research</li>
                <li>Image gallery recommendations</li>
                <li>Launch checklist and timeline</li>
              </ul>
            `}
          </div>
          
          <p><strong>Need help implementing these recommendations?</strong></p>
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

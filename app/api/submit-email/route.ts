import { NextRequest, NextResponse } from 'next/server';

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

    // TODO: Integrate with your email service here
    // Examples:
    // - SendGrid
    // - Mailchimp
    // - ConvertKit
    // - Your own SMTP server
    
    console.log('Email submission received:', { email, name, mode });

    // For now, we'll simulate a successful email send
    // In production, replace this with actual email service integration
    
    // Example with SendGrid (you'll need to install @sendgrid/mail):
    /*
    import sgMail from '@sendgrid/mail';
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    
    const msg = {
      to: email,
      from: 'noreply@e-ctrl.com',
      subject: mode === 'audit' 
        ? 'Your Amazon Audit Report is Ready!' 
        : 'Your Amazon Listing Pack is Ready!',
      templateId: mode === 'audit' 
        ? 'd-your-audit-template-id' 
        : 'd-your-listing-template-id',
      dynamicTemplateData: {
        name: name || 'there',
        mode: mode
      }
    };
    
    await sgMail.send(msg);
    */

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Email submitted successfully',
        email,
        mode 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email submission error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to submit email. Please try again.' 
      },
      { status: 500 }
    );
  }
}

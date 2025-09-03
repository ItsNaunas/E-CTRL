import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

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

    // Send welcome email using Resend
    const emailResult = await sendWelcomeEmail({
      to: email,
      name: name || 'there',
      mode: mode || 'audit'
    });

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      // For now, return success even if email fails to prevent blocking the user
      return NextResponse.json(
        { 
          success: true, 
          message: 'Email submitted successfully! (Email delivery may be delayed)',
          email,
          mode,
          warning: 'Email service temporarily unavailable'
        },
        { status: 200 }
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
        messageId: emailResult.messageId
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

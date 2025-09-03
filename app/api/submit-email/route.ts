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
    console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY?.length);
    console.log('RESEND_API_KEY starts with:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');

    // Send welcome email using Resend (basic welcome email, no PDF for guest access)
    console.log('About to call sendWelcomeEmail...');
    const emailResult = await sendWelcomeEmail({
      to: email,
      name: name || 'there',
      mode: mode || 'audit'
      // Note: No PDF data for guest access - they get basic welcome email only
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
        messageId: emailResult.messageId
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

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateLeadEmail } from '@/lib/database';
import { sendWelcomeEmail } from '@/lib/email';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required'),
  leadId: z.string().uuid('Invalid lead ID'),
  mode: z.enum(['audit', 'create']).optional().default('audit'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Email API received:', body);
    
    const validatedData = emailSchema.parse(body);
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

    // Send welcome email
    const emailResult = await sendWelcomeEmail({
      to: validatedData.email,
      name: validatedData.name,
      mode: validatedData.mode
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
      messageId: emailResult.success ? emailResult.messageId : null
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

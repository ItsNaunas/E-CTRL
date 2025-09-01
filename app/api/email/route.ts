import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateLeadEmail } from '@/lib/database';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required'),
  leadId: z.string().uuid('Invalid lead ID'),
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

    // TODO: Send email with report link
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: 'Email submitted successfully'
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

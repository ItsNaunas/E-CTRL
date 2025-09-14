import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { upgradeGuestToAccount } from '@/lib/database';

// Initialize Supabase client only when needed (not during build)
let supabase: any = null;

function initializeSupabase() {
  if (supabase) return supabase;
  
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables:', {
      supabaseUrl: !!supabaseUrl,
      supabaseServiceKey: !!supabaseServiceKey
    });
    return null;
  }
  
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    return supabase;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabaseClient = initializeSupabase();
    if (!supabaseClient) {
      console.error('Supabase not configured - missing environment variables');
      return NextResponse.json(
        { error: 'User registration service is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const { email, password, name, promotionalConsent = false } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Use the upgrade function to handle guest-to-account conversion
    const upgradeResult = await upgradeGuestToAccount(
      email, 
      name, 
      passwordHash, 
      promotionalConsent
    );

    if (!upgradeResult.success) {
      return NextResponse.json(
        { error: upgradeResult.message || 'Failed to create account' },
        { status: 500 }
      );
    }

    console.log('User registered/upgraded successfully:', { 
      userId: upgradeResult.userId, 
      email: email,
      message: upgradeResult.message 
    });

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: upgradeResult.message || 'Account created successfully!',
        userId: upgradeResult.userId
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('User registration error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create account. Please try again.' 
      },
      { status: 500 }
    );
  }
}

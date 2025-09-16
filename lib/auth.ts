import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { supabaseAdmin } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

export interface AuthResult {
  user: AuthUser | null;
  error?: string;
}

/**
 * Verify authentication from request cookies
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return { user: null, error: 'No authentication token' };
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (jwtError) {
      return { user: null, error: 'Invalid token' };
    }

    // Get fresh user data from database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, name, is_active, email_verified')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return { user: null, error: 'User not found' };
    }

    // Check if account is still active
    if (!user.is_active) {
      return { user: null, error: 'Account is disabled' };
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.email_verified
      }
    };

  } catch (error) {
    console.error('Auth verification error:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

/**
 * Check if user is authenticated, return user data or null
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const result = await verifyAuth(request);
  return result.user;
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const result = await verifyAuth(request);
  
  if (!result.user) {
    throw new Error(result.error || 'Authentication required');
  }
  
  return result.user;
}

/**
 * Generate JWT token for user
 */
export function generateToken(user: { id: string; email: string; name: string; emailVerified: boolean }): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

import { supabase, supabaseAdmin, TABLES, type Lead, type Report, type ReportWithLead, type AuditType, type AccessType } from './supabase';
import type { ExistingSellerData, NewSellerData } from './validation';

// Get client IP address from request headers
export function getClientIP(headers: Headers): string | undefined {
  const forwarded = headers.get('x-forwarded-for');
  const realIP = headers.get('x-real-ip');
  const cfConnectingIP = headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return undefined;
}

// Check rate limit using database function with access type support
export async function checkRateLimit(
  email: string, 
  auditType: AuditType, 
  accessType: AccessType = 'guest'
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
      p_email: email,
      p_audit_type: auditType,
      p_access_type: accessType
    });
    
    if (error) {
      console.error('Rate limit check error:', error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return false;
  }
}

// Create a new lead from form data
export async function createLead(
  formData: ExistingSellerData | NewSellerData,
  auditType: AuditType,
  headers: Headers
): Promise<Lead | null> {
  try {
    const leadData: Partial<Lead> = {
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      audit_type: auditType,
      ip_address: getClientIP(headers),
      user_agent: headers.get('user-agent') || undefined,
      referrer: headers.get('referer') || undefined,
    };

    // Add audit-type specific fields
    if (auditType === 'existing_seller') {
      const existingData = formData as ExistingSellerData;
      leadData.asin = existingData.asin;
      leadData.keywords = existingData.keywords;
      leadData.fulfilment = existingData.fulfilment;
    } else {
      const newData = formData as NewSellerData;
      leadData.website_url = newData.websiteUrl;
      leadData.no_website_desc = newData.noWebsiteDesc;
      leadData.category = newData.category;
      leadData.product_desc = newData.desc;
      leadData.fulfilment_intent = newData.fulfilmentIntent;
    }

    const { data, error } = await supabaseAdmin
      .from(TABLES.LEADS)
      .insert(leadData)
      .select()
      .single();

    if (error) {
      console.error('Create lead error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Create lead failed:', error);
    return null;
  }
}

// Update lead email (when user submits their real email)
export async function updateLeadEmail(leadId: string, email: string, name: string): Promise<Lead | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLES.LEADS)
      .update({ 
        email: email,
        name: name,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      console.error('Update lead email error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Update lead email failed:', error);
    return null;
  }
}

// Upgrade guest user to account user (handle email duplicates)
export async function upgradeGuestToAccount(
  email: string, 
  name: string, 
  password: string,
  promotionalConsent: boolean = false
): Promise<{ success: boolean; userId?: string; message?: string }> {
  try {
    // First, check if user already exists
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from(TABLES.USERS)
      .select('id, email')
      .eq('email', email)
      .single();

    if (userCheckError) {
      // If error is "not found", that's expected for new users
      if (userCheckError.code === 'PGRST116') {
        console.log('No existing user found for email:', email);
        // Continue with account creation
      } else {
        console.error('Error checking existing user:', userCheckError);
        return { success: false, message: 'Database error checking user' };
      }
    } else if (existingUser) {
      // User already exists, return their ID
      return { 
        success: true, 
        userId: existingUser.id,
        message: 'Account already exists for this email'
      };
    }

    // Check if there are guest leads with this email
    const { data: guestLeads, error: leadsError } = await supabaseAdmin
      .from(TABLES.LEADS)
      .select('id, email, name, user_id')
      .eq('email', email)
      .is('user_id', null); // Guest leads have null user_id

    if (leadsError) {
      console.error('Error checking guest leads:', leadsError);
      return { success: false, message: 'Database error' };
    }

    // Create new user account
    const { data: newUser, error: createUserError } = await supabaseAdmin
      .from(TABLES.USERS)
      .insert({
        email: email,
        name: name,
        password_hash: password, // Note: In production, this should be hashed
        email_verified: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createUserError) {
      console.error('Error creating user:', createUserError);
      return { success: false, message: 'Failed to create account' };
    }

    // Update guest leads to link to the new user account
    if (guestLeads && guestLeads.length > 0) {
      const { error: updateLeadsError } = await supabaseAdmin
        .from(TABLES.LEADS)
        .update({ 
          user_id: newUser.id,
          name: name, // Update name in leads too
          updated_at: new Date().toISOString()
        })
        .in('id', guestLeads.map(lead => lead.id));

      if (updateLeadsError) {
        console.error('Error updating guest leads:', updateLeadsError);
        // Don't fail the whole operation, just log the error
      }
    }

    // Update any existing reports to link to the new user AND upgrade access type
    if (guestLeads && guestLeads.length > 0) {
      const { error: updateReportsError } = await supabaseAdmin
        .from(TABLES.REPORTS)
        .update({ 
          user_id: newUser.id,
          access_type: 'account', // Upgrade all existing reports to account access
          updated_at: new Date().toISOString()
        })
        .in('lead_id', guestLeads.map(lead => lead.id));

      if (updateReportsError) {
        console.error('Error updating reports:', updateReportsError);
        // Don't fail the whole operation, just log the error
      }
    }

    return { 
      success: true, 
      userId: newUser.id,
      message: 'Account created successfully'
    };

  } catch (error) {
    console.error('Upgrade guest to account failed:', error);
    return { success: false, message: 'Internal server error' };
  }
}

// Create an audit report
export async function createAuditReport(
  leadId: string,
  score: number,
  highlights: string[],
  recommendations: string[],
  detailedAnalysis: any,
  userId?: string,
  accessType: AccessType = 'guest'
): Promise<Report | null> {
  try {
    const { data, error } = await supabaseAdmin.rpc('create_audit_report', {
      p_lead_id: leadId,
      p_score: score,
      p_highlights: highlights,
      p_recommendations: recommendations,
      p_detailed_analysis: detailedAnalysis,
      p_user_id: userId,
      p_access_type: accessType
    });

    if (error) {
      console.error('Create report error:', error);
      return null;
    }

    // Fetch the created report
    const { data: report, error: fetchError } = await supabaseAdmin
      .from(TABLES.REPORTS)
      .select('*')
      .eq('id', data)
      .single();

    if (fetchError) {
      console.error('Fetch report error:', fetchError);
      return null;
    }

    return report;
  } catch (error) {
    console.error('Create report failed:', error);
    return null;
  }
}

// Get report by ID
export async function getReport(reportId: string): Promise<Report | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLES.REPORTS)
      .select(`
        *,
        leads (
          id,
          email,
          name,
          audit_type,
          asin,
          keywords,
          fulfilment,
          website_url,
          category,
          product_desc,
          fulfilment_intent
        )
      `)
      .eq('id', reportId)
      .single();

    if (error) {
      console.error('Get report error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get report failed:', error);
    return null;
  }
}

// Get reports by email
export async function getReportsByEmail(email: string): Promise<ReportWithLead[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLES.REPORTS)
      .select(`
        *,
        leads!inner (
          id,
          email,
          name,
          audit_type
        )
      `)
      .eq('leads.email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get reports by email error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get reports by email failed:', error);
    return [];
  }
}

// Get the latest report (regardless of email) - useful for testing
export async function getLatestReport(): Promise<ReportWithLead | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLES.REPORTS)
      .select(`
        *,
        leads!inner (
          id,
          email,
          name,
          audit_type,
          asin,
          website_url,
          keywords,
          fulfilment,
          category,
          product_desc
        )
      `)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Get latest report error:', error);
      return null;
    }

    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Get latest report failed:', error);
    return null;
  }
}

// Track analytics event
export async function trackEvent(
  eventType: string,
  eventData?: any,
  userId?: string,
  leadId?: string,
  headers?: Headers
): Promise<void> {
  try {
    const event: Partial<any> = {
      event_type: eventType,
      event_data: eventData,
      user_id: userId,
      lead_id: leadId,
    };

    if (headers) {
      event.ip_address = getClientIP(headers);
      event.user_agent = headers.get('user-agent') || undefined;
      event.referrer = headers.get('referer') || undefined;
    }

    const { error } = await supabaseAdmin
      .from(TABLES.ANALYTICS_EVENTS)
      .insert(event);

    if (error) {
      console.error('Track event error:', error);
    }
  } catch (error) {
    console.error('Track event failed:', error);
  }
}


// Mark report as email sent
export async function markReportEmailSent(reportId: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from(TABLES.REPORTS)
      .update({ 
        email_sent: true, 
        email_sent_at: new Date().toISOString() 
      })
      .eq('id', reportId);

    if (error) {
      console.error('Mark report email sent error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Mark report email sent failed:', error);
    return false;
  }
}


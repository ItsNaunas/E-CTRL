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

// Check rate limit using database function
export async function checkRateLimit(email: string, auditType: AuditType): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
      p_email: email,
      p_audit_type: auditType
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
      // Note: image_url will be set after file upload
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

// Update lead with image URL (for new sellers)
export async function updateLeadImage(leadId: string, imageUrl: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from(TABLES.LEADS)
      .update({ image_url: imageUrl })
      .eq('id', leadId);

    if (error) {
      console.error('Update lead image error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Update lead image failed:', error);
    return false;
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


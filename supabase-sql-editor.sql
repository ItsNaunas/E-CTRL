-- e-ctrl Amazon Audit Tool Database Schema
-- Copy and paste this entire file into Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE audit_type AS ENUM ('existing_seller', 'new_seller');
CREATE TYPE fulfilment_type AS ENUM ('FBA', 'FBM', 'Unsure');
CREATE TYPE report_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE access_type AS ENUM ('guest', 'account');

-- Users table (for account-based access)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- NULL for guest users
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token UUID,
    reset_token UUID,
    reset_token_expires TIMESTAMP WITH TIME ZONE
);

-- Leads table (stores all form submissions)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    audit_type audit_type NOT NULL,
    
    -- Existing seller specific fields
    asin VARCHAR(20),
    keywords TEXT[], -- Array of keywords
    fulfilment fulfilment_type,
    
    -- New seller specific fields
    website_url TEXT,
    no_website_desc TEXT,
    category VARCHAR(100),
    product_desc TEXT,
    fulfilment_intent fulfilment_type,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Optional user association
    user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Reports table (stores generated audit reports)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Report data
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    highlights TEXT[], -- Array of key findings
    recommendations TEXT[], -- Array of actionable recommendations
    detailed_analysis JSONB, -- Full audit data
    
    -- Report metadata
    status report_status DEFAULT 'pending',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Rate limiting
    access_type access_type DEFAULT 'guest',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limiting table (enforces 1 report per email per day)
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    audit_type audit_type NOT NULL,
    last_request_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    request_count INTEGER DEFAULT 1,
    
    -- Composite unique constraint
    UNIQUE(email, audit_type)
);

-- Email logs table (tracks email delivery)
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'sent', 'delivered', 'bounced', 'failed'
    message_id VARCHAR(255), -- Resend message ID
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table (for tracking user behavior)
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL, -- 'page_view', 'form_start', 'form_submit', 'report_view'
    event_data JSONB,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    page_url TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_audit_type ON leads(audit_type);
CREATE INDEX idx_reports_lead_id ON reports(lead_id);
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_rate_limits_email ON rate_limits(email);
CREATE INDEX idx_email_logs_report_id ON email_logs(report_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_email VARCHAR(255),
    p_audit_type audit_type,
    p_access_type access_type DEFAULT 'guest'
)
RETURNS BOOLEAN AS $$
DECLARE
    last_request TIMESTAMP WITH TIME ZONE;
    current_count INTEGER;
    has_account BOOLEAN := FALSE;
    daily_limit INTEGER;
BEGIN
    -- Check if user has an account
    SELECT EXISTS(SELECT 1 FROM users WHERE email = p_email AND is_active = TRUE)
    INTO has_account;
    
    -- Set rate limits based on account type
    -- Account users: 5 reports per day
    -- Guest users: 1 report per day  
    -- Override: If someone just upgraded to account, allow immediate access
    IF has_account OR p_access_type = 'account' THEN
        daily_limit := 5;
    ELSE
        daily_limit := 1;
    END IF;
    
    -- Check existing rate limit record
    SELECT last_request_at, request_count 
    INTO last_request, current_count
    FROM rate_limits 
    WHERE email = p_email AND audit_type = p_audit_type;
    
    -- If no previous request, allow and create record
    IF last_request IS NULL THEN
        INSERT INTO rate_limits (email, audit_type, last_request_at, request_count)
        VALUES (p_email, p_audit_type, NOW(), 1);
        RETURN TRUE;
    END IF;
    
    -- If last request was more than 24 hours ago, reset counter
    IF last_request < NOW() - INTERVAL '24 hours' THEN
        UPDATE rate_limits 
        SET last_request_at = NOW(), request_count = 1
        WHERE email = p_email AND audit_type = p_audit_type;
        RETURN TRUE;
    END IF;
    
    -- Special case: If user just upgraded to account and was previously rate limited,
    -- allow one immediate request regardless of previous count
    IF has_account AND p_access_type = 'account' AND current_count >= 1 THEN
        -- Check if they have any guest reports (indicating they upgraded)
        IF EXISTS(
            SELECT 1 FROM reports r 
            JOIN leads l ON r.lead_id = l.id 
            WHERE l.email = p_email AND r.access_type = 'guest'
        ) THEN
            -- Allow the upgrade request but don't reset the counter completely
            UPDATE rate_limits 
            SET last_request_at = NOW()
            WHERE email = p_email AND audit_type = p_audit_type;
            RETURN TRUE;
        END IF;
    END IF;
    
    -- Check if within daily limit
    IF current_count >= daily_limit THEN
        RETURN FALSE;
    END IF;
    
    -- Increment count and allow
    UPDATE rate_limits 
    SET request_count = request_count + 1, last_request_at = NOW()
    WHERE email = p_email AND audit_type = p_audit_type;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to create a new audit report
CREATE OR REPLACE FUNCTION create_audit_report(
    p_lead_id UUID,
    p_user_id UUID DEFAULT NULL,
    p_score INTEGER,
    p_highlights TEXT[],
    p_recommendations TEXT[],
    p_detailed_analysis JSONB,
    p_access_type access_type DEFAULT 'guest'
)
RETURNS UUID AS $$
DECLARE
    report_id UUID;
BEGIN
    INSERT INTO reports (
        lead_id, 
        user_id, 
        score, 
        highlights, 
        recommendations, 
        detailed_analysis,
        status,
        access_type
    ) VALUES (
        p_lead_id,
        p_user_id,
        p_score,
        p_highlights,
        p_recommendations,
        p_detailed_analysis,
        'completed',
        p_access_type
    ) RETURNING id INTO report_id;
    
    RETURN report_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Leads are readable by the user who created them
CREATE POLICY "Users can view own leads" ON leads
    FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

-- Reports are readable by the user who created them
CREATE POLICY "Users can view own reports" ON reports
    FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

-- Service role can access all data (for API operations)
CREATE POLICY "Service role full access" ON users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON leads
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON reports
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON rate_limits
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON email_logs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON analytics_events
    FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Enhanced Rate Limiting System for E-CTRL
-- Supports different operation types with custom limits

-- Create operation usage tracking table
CREATE TABLE IF NOT EXISTS operation_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    operation VARCHAR(50) NOT NULL, -- 'analysis', 'scraping', 'suggestions', etc.
    access_type access_type NOT NULL,
    cost_weight DECIMAL(4,2) DEFAULT 1.0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for fast lookups
    INDEX idx_operation_usage_email_operation (email, operation),
    INDEX idx_operation_usage_created_at (created_at)
);

-- Enhanced rate limiting function with operation-specific limits
CREATE OR REPLACE FUNCTION check_operation_rate_limit(
    p_email VARCHAR(255),
    p_operation VARCHAR(50),
    p_access_type access_type DEFAULT 'guest',
    p_limit_count INTEGER DEFAULT 1,
    p_window_hours INTEGER DEFAULT 24
)
RETURNS TABLE(
    allowed BOOLEAN,
    current_count INTEGER,
    reset_time TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    window_start TIMESTAMP WITH TIME ZONE;
    usage_count INTEGER;
    next_reset TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Calculate window start time
    window_start := NOW() - (p_window_hours || ' hours')::INTERVAL;
    next_reset := NOW() + (p_window_hours || ' hours')::INTERVAL;
    
    -- Count operations in current window
    SELECT COUNT(*)
    INTO usage_count
    FROM operation_usage
    WHERE email = p_email 
      AND operation = p_operation
      AND created_at >= window_start;
    
    -- Check if under limit
    IF usage_count < p_limit_count THEN
        -- Record this check as a usage
        INSERT INTO operation_usage (
            email, 
            operation, 
            access_type,
            cost_weight,
            metadata
        ) VALUES (
            p_email,
            p_operation,
            p_access_type,
            1.0,
            jsonb_build_object(
                'check_time', NOW(),
                'window_hours', p_window_hours,
                'limit_count', p_limit_count
            )
        );
        
        RETURN QUERY SELECT TRUE, usage_count + 1, next_reset;
    ELSE
        RETURN QUERY SELECT FALSE, usage_count, next_reset;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to record successful operations (for analytics)
CREATE OR REPLACE FUNCTION record_operation_usage(
    p_email VARCHAR(255),
    p_operation VARCHAR(50),
    p_access_type access_type DEFAULT 'guest',
    p_cost_weight DECIMAL(4,2) DEFAULT 1.0,
    p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO operation_usage (
        email,
        operation,
        access_type,
        cost_weight,
        metadata
    ) VALUES (
        p_email,
        p_operation,
        p_access_type,
        p_cost_weight,
        p_metadata
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get user usage statistics
CREATE OR REPLACE FUNCTION get_user_usage_stats(
    p_email VARCHAR(255)
)
RETURNS TABLE(
    operation VARCHAR(50),
    access_type access_type,
    daily_count INTEGER,
    weekly_count INTEGER,
    monthly_count INTEGER,
    total_cost_weight DECIMAL(8,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ou.operation,
        ou.access_type,
        COUNT(CASE WHEN ou.created_at >= NOW() - INTERVAL '1 day' THEN 1 END)::INTEGER as daily_count,
        COUNT(CASE WHEN ou.created_at >= NOW() - INTERVAL '7 days' THEN 1 END)::INTEGER as weekly_count,
        COUNT(CASE WHEN ou.created_at >= NOW() - INTERVAL '30 days' THEN 1 END)::INTEGER as monthly_count,
        SUM(ou.cost_weight)::DECIMAL(8,2) as total_cost_weight
    FROM operation_usage ou
    WHERE ou.email = p_email
    GROUP BY ou.operation, ou.access_type
    ORDER BY ou.operation;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old usage records (run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_usage_records()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete records older than 3 months
    DELETE FROM operation_usage 
    WHERE created_at < NOW() - INTERVAL '3 months';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create index for faster cleanup
CREATE INDEX IF NOT EXISTS idx_operation_usage_cleanup 
ON operation_usage (created_at) 
WHERE created_at < NOW() - INTERVAL '3 months';

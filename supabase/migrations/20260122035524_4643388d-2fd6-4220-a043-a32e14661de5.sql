-- Add RLS policies for password_reset_attempts table
-- This table stores IP addresses which is sensitive data

-- Drop existing policy if any
DROP POLICY IF EXISTS "No public access to password reset attempts" ON public.password_reset_attempts;

-- Create policy to deny all direct access (only edge functions with service role can access)
CREATE POLICY "No public access to password reset attempts"
ON public.password_reset_attempts
FOR ALL
USING (false)
WITH CHECK (false);

-- Create a table for persistent contact form rate limiting
CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contact_rate_limits
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

-- No public access - only service role can read/write
CREATE POLICY "No public access to contact rate limits"
ON public.contact_rate_limits
FOR ALL
USING (false)
WITH CHECK (false);

-- Create index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_contact_rate_limits_ip_created 
ON public.contact_rate_limits (ip_address, created_at);

-- Create index for password_reset_attempts for better query performance
CREATE INDEX IF NOT EXISTS idx_password_reset_attempts_email_created 
ON public.password_reset_attempts (email, created_at);

CREATE INDEX IF NOT EXISTS idx_password_reset_attempts_ip_created 
ON public.password_reset_attempts (ip_address, created_at);

-- Create a function to clean up old rate limit records (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.contact_rate_limits 
  WHERE created_at < now() - interval '1 hour';
  
  DELETE FROM public.password_reset_attempts 
  WHERE created_at < now() - interval '1 day';
END;
$$;
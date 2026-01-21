-- Create table for rate limiting password reset attempts
CREATE TABLE public.password_reset_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX idx_password_reset_email_time ON public.password_reset_attempts (email, created_at);
CREATE INDEX idx_password_reset_ip_time ON public.password_reset_attempts (ip_address, created_at);

-- Enable RLS
ALTER TABLE public.password_reset_attempts ENABLE ROW LEVEL SECURITY;

-- No direct access from client - only via edge function with service role
-- This table is managed entirely by the backend
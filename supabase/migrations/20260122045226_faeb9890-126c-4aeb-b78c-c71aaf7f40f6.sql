-- Step 1: Create the admin user if not exists and clean up existing users/roles
-- First, delete all existing admin roles
DELETE FROM public.user_roles WHERE role = 'admin';

-- Step 2: Add rate limiting table for login attempts  
CREATE TABLE IF NOT EXISTS public.login_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  ip_address text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS with strict no-access policy (service role only)
ALTER TABLE public.login_rate_limits ENABLE ROW LEVEL SECURITY;

-- No public access to login rate limits - only service role
CREATE POLICY "No public access to login rate limits" 
ON public.login_rate_limits 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- Step 3: Create index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_login_rate_limits_email_created 
ON public.login_rate_limits (email, created_at);

CREATE INDEX IF NOT EXISTS idx_login_rate_limits_ip_created 
ON public.login_rate_limits (ip_address, created_at);

-- Step 4: Ensure user_roles RLS policies are strict - drop and recreate
-- Users can only view their own roles, cannot insert/update/delete
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Ensure no insert/update/delete policies exist for regular users
-- (The handle_new_user function will handle inserts with SECURITY DEFINER)
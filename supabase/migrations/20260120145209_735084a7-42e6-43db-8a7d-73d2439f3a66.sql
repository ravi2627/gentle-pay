-- Add default payment link flag to payment_links table
ALTER TABLE public.payment_links 
ADD COLUMN IF NOT EXISTS is_default boolean NOT NULL DEFAULT false;

-- Add reminder schedule fields to invoices table
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS client_email text,
ADD COLUMN IF NOT EXISTS payment_link_id uuid REFERENCES public.payment_links(id),
ADD COLUMN IF NOT EXISTS reminder_enabled boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS reminder_tone text NOT NULL DEFAULT 'polite',
ADD COLUMN IF NOT EXISTS email_3_days_before boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS email_on_due_date boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS email_3_days_after boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS email_7_days_after boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_enabled boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_days_after_due integer DEFAULT 3;

-- Add tracking fields to reminders table
ALTER TABLE public.reminders
ADD COLUMN IF NOT EXISTS scheduled_for timestamp with time zone,
ADD COLUMN IF NOT EXISTS reminder_type text DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS tone text DEFAULT 'polite';

-- Function to ensure only one default payment link per user
CREATE OR REPLACE FUNCTION public.ensure_single_default_payment_link()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.payment_links 
    SET is_default = false 
    WHERE user_id = NEW.user_id 
    AND id != NEW.id 
    AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for single default payment link
DROP TRIGGER IF EXISTS ensure_single_default_payment_link_trigger ON public.payment_links;
CREATE TRIGGER ensure_single_default_payment_link_trigger
BEFORE INSERT OR UPDATE ON public.payment_links
FOR EACH ROW
EXECUTE FUNCTION public.ensure_single_default_payment_link();

-- Create index for faster default link lookup
CREATE INDEX IF NOT EXISTS idx_payment_links_default ON public.payment_links(user_id, is_default) WHERE is_default = true;
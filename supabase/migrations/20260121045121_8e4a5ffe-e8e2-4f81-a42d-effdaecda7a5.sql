-- Invoice Activity Logs Table for tracking all invoice events
CREATE TABLE public.invoice_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoice_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own invoice activity logs" 
  ON public.invoice_activity_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own invoice activity logs" 
  ON public.invoice_activity_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_invoice_activity_logs_invoice_id ON public.invoice_activity_logs(invoice_id);
CREATE INDEX idx_invoice_activity_logs_created_at ON public.invoice_activity_logs(created_at DESC);

-- Add delivery tracking fields to invoice_reminders table
ALTER TABLE public.invoice_reminders 
  ADD COLUMN IF NOT EXISTS failure_reason TEXT,
  ADD COLUMN IF NOT EXISTS opened_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS open_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tracking_id TEXT;

-- Add foreign key constraint for invoice_reminders to invoices
ALTER TABLE public.invoice_reminders 
  ADD CONSTRAINT fk_invoice_reminders_invoice 
  FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;

-- Create function to log invoice activity
CREATE OR REPLACE FUNCTION public.log_invoice_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
    VALUES (NEW.id, NEW.user_id, 'invoice_created', jsonb_build_object(
      'invoice_number', NEW.invoice_number,
      'amount', NEW.amount,
      'due_date', NEW.due_date
    ));
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log status change
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
      VALUES (NEW.id, NEW.user_id, 
        CASE WHEN NEW.status = 'paid' THEN 'invoice_paid' ELSE 'status_changed' END,
        jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
      );
    END IF;
    -- Log due date change
    IF OLD.due_date IS DISTINCT FROM NEW.due_date THEN
      INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
      VALUES (NEW.id, NEW.user_id, 'due_date_changed', jsonb_build_object(
        'old_due_date', OLD.due_date,
        'new_due_date', NEW.due_date
      ));
    END IF;
    -- Log amount change
    IF OLD.amount IS DISTINCT FROM NEW.amount THEN
      INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
      VALUES (NEW.id, NEW.user_id, 'invoice_edited', jsonb_build_object(
        'old_amount', OLD.amount,
        'new_amount', NEW.amount
      ));
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for invoice activity logging
CREATE TRIGGER log_invoice_activity_trigger
  AFTER INSERT OR UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.log_invoice_activity();

-- Create function to cancel reminders when invoice is paid
CREATE OR REPLACE FUNCTION public.cancel_reminders_on_paid()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    UPDATE public.invoice_reminders
    SET status = 'cancelled', updated_at = now()
    WHERE invoice_id = NEW.id AND status = 'scheduled';
    
    -- Log the cancellation
    INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
    VALUES (NEW.id, NEW.user_id, 'reminders_cancelled', jsonb_build_object(
      'reason', 'invoice_marked_paid'
    ));
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for cancelling reminders when paid
CREATE TRIGGER cancel_reminders_on_paid_trigger
  AFTER UPDATE ON public.invoices
  FOR EACH ROW
  WHEN (NEW.status = 'paid' AND OLD.status != 'paid')
  EXECUTE FUNCTION public.cancel_reminders_on_paid();

-- Function to log reminder events
CREATE OR REPLACE FUNCTION public.log_reminder_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
    VALUES (NEW.invoice_id, NEW.user_id, 'reminder_scheduled', jsonb_build_object(
      'reminder_id', NEW.id,
      'channel', NEW.channel,
      'tone', NEW.tone,
      'timing_type', NEW.timing_type,
      'timing_days', NEW.timing_days,
      'scheduled_for', NEW.scheduled_for
    ));
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log reminder sent
    IF OLD.status = 'scheduled' AND NEW.status = 'sent' THEN
      INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
      VALUES (NEW.invoice_id, NEW.user_id, 
        CASE WHEN NEW.channel = 'email' THEN 'email_sent' 
             WHEN NEW.channel = 'sms' THEN 'sms_sent'
             ELSE 'reminder_sent' END,
        jsonb_build_object(
          'reminder_id', NEW.id,
          'channel', NEW.channel,
          'tone', NEW.tone
        ));
    END IF;
    -- Log email opened
    IF NEW.opened_at IS NOT NULL AND OLD.opened_at IS NULL THEN
      INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
      VALUES (NEW.invoice_id, NEW.user_id, 'email_opened', jsonb_build_object(
        'reminder_id', NEW.id,
        'opened_at', NEW.opened_at
      ));
    END IF;
    -- Log reminder cancelled
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
      INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
      VALUES (NEW.invoice_id, NEW.user_id, 'reminder_cancelled', jsonb_build_object(
        'reminder_id', NEW.id,
        'reason', 'manual_cancel'
      ));
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for reminder activity logging
CREATE TRIGGER log_reminder_activity_trigger
  AFTER INSERT OR UPDATE ON public.invoice_reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.log_reminder_activity();
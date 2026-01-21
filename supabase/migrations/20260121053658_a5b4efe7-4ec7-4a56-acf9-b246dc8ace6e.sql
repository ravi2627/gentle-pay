-- Create email_logs table for tracking email delivery
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  reminder_id UUID REFERENCES public.invoice_reminders(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_type TEXT NOT NULL DEFAULT 'reminder',
  status TEXT NOT NULL DEFAULT 'pending',
  tracking_id TEXT UNIQUE,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  open_count INTEGER DEFAULT 0,
  failed_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  resend_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sms_logs table for tracking SMS delivery
CREATE TABLE public.sms_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  reminder_id UUID REFERENCES public.invoice_reminders(id) ON DELETE SET NULL,
  recipient_phone TEXT NOT NULL,
  message_body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  twilio_sid TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_logs
CREATE POLICY "Users can view their own email logs"
  ON public.email_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email logs"
  ON public.email_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email logs"
  ON public.email_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for sms_logs
CREATE POLICY "Users can view their own sms logs"
  ON public.sms_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sms logs"
  ON public.sms_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sms logs"
  ON public.sms_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_email_logs_invoice ON public.email_logs(invoice_id);
CREATE INDEX idx_email_logs_user ON public.email_logs(user_id);
CREATE INDEX idx_email_logs_tracking ON public.email_logs(tracking_id);
CREATE INDEX idx_sms_logs_invoice ON public.sms_logs(invoice_id);
CREATE INDEX idx_sms_logs_user ON public.sms_logs(user_id);

-- Function to log email activity to invoice_activity_logs
CREATE OR REPLACE FUNCTION public.log_email_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
    VALUES (NEW.invoice_id, NEW.user_id, 'email_queued', jsonb_build_object(
      'email_log_id', NEW.id,
      'recipient', NEW.recipient_email,
      'subject', NEW.subject
    ));
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log email sent
    IF OLD.status != 'sent' AND NEW.status = 'sent' THEN
      INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
      VALUES (NEW.invoice_id, NEW.user_id, 'email_sent', jsonb_build_object(
        'email_log_id', NEW.id,
        'sent_at', NEW.sent_at
      ));
    END IF;
    -- Log email opened
    IF NEW.opened_at IS NOT NULL AND OLD.opened_at IS NULL THEN
      INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
      VALUES (NEW.invoice_id, NEW.user_id, 'email_opened', jsonb_build_object(
        'email_log_id', NEW.id,
        'opened_at', NEW.opened_at
      ));
    END IF;
    -- Log email failed
    IF OLD.status != 'failed' AND NEW.status = 'failed' THEN
      INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
      VALUES (NEW.invoice_id, NEW.user_id, 'email_failed', jsonb_build_object(
        'email_log_id', NEW.id,
        'reason', NEW.failure_reason
      ));
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Function to log SMS activity to invoice_activity_logs
CREATE OR REPLACE FUNCTION public.log_sms_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
    VALUES (NEW.invoice_id, NEW.user_id, 'sms_queued', jsonb_build_object(
      'sms_log_id', NEW.id,
      'recipient', NEW.recipient_phone
    ));
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log SMS sent
    IF OLD.status != 'sent' AND NEW.status = 'sent' THEN
      INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
      VALUES (NEW.invoice_id, NEW.user_id, 'sms_sent', jsonb_build_object(
        'sms_log_id', NEW.id,
        'sent_at', NEW.sent_at
      ));
    END IF;
    -- Log SMS delivered
    IF OLD.status != 'delivered' AND NEW.status = 'delivered' THEN
      INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
      VALUES (NEW.invoice_id, NEW.user_id, 'sms_delivered', jsonb_build_object(
        'sms_log_id', NEW.id,
        'delivered_at', NEW.delivered_at
      ));
    END IF;
    -- Log SMS failed
    IF OLD.status != 'failed' AND NEW.status = 'failed' THEN
      INSERT INTO public.invoice_activity_logs (invoice_id, user_id, event_type, event_data)
      VALUES (NEW.invoice_id, NEW.user_id, 'sms_failed', jsonb_build_object(
        'sms_log_id', NEW.id,
        'reason', NEW.failure_reason
      ));
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Create triggers for email and SMS logging
CREATE TRIGGER log_email_activity_trigger
  AFTER INSERT OR UPDATE ON public.email_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.log_email_activity();

CREATE TRIGGER log_sms_activity_trigger
  AFTER INSERT OR UPDATE ON public.sms_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.log_sms_activity();
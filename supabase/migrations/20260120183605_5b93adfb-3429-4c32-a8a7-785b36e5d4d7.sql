-- Create invoice_reminders table for flexible per-invoice reminder scheduling
CREATE TABLE public.invoice_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  timing_type TEXT NOT NULL CHECK (timing_type IN ('before', 'on_due', 'after')),
  timing_days INTEGER NOT NULL DEFAULT 0, -- 0 for on_due_date
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'both')),
  tone TEXT NOT NULL CHECK (tone IN ('polite', 'professional', 'firm')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'failed', 'cancelled')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoice_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own invoice reminders"
ON public.invoice_reminders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own invoice reminders"
ON public.invoice_reminders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoice reminders"
ON public.invoice_reminders FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoice reminders"
ON public.invoice_reminders FOR DELETE
USING (auth.uid() = user_id);

-- Index for efficient lookups
CREATE INDEX idx_invoice_reminders_invoice ON public.invoice_reminders(invoice_id);
CREATE INDEX idx_invoice_reminders_user ON public.invoice_reminders(user_id);
CREATE INDEX idx_invoice_reminders_scheduled ON public.invoice_reminders(scheduled_for) WHERE status = 'scheduled';

-- Trigger for updated_at
CREATE TRIGGER update_invoice_reminders_updated_at
BEFORE UPDATE ON public.invoice_reminders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate scheduled_for based on invoice due_date and timing
CREATE OR REPLACE FUNCTION public.calculate_reminder_schedule()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the invoice due_date
  SELECT 
    CASE 
      WHEN NEW.timing_type = 'before' THEN 
        (SELECT due_date FROM public.invoices WHERE id = NEW.invoice_id)::timestamp - (NEW.timing_days || ' days')::interval
      WHEN NEW.timing_type = 'on_due' THEN 
        (SELECT due_date FROM public.invoices WHERE id = NEW.invoice_id)::timestamp
      WHEN NEW.timing_type = 'after' THEN 
        (SELECT due_date FROM public.invoices WHERE id = NEW.invoice_id)::timestamp + (NEW.timing_days || ' days')::interval
    END INTO NEW.scheduled_for;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER calculate_reminder_schedule_trigger
BEFORE INSERT OR UPDATE ON public.invoice_reminders
FOR EACH ROW
EXECUTE FUNCTION public.calculate_reminder_schedule();
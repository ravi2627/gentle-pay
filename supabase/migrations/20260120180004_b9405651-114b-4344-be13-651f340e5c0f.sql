-- Step 1: Drop the NOT NULL constraint on invoice_id and make it nullable
-- First, we need to remove the invoice_id column entirely since payment links should be user-level
ALTER TABLE public.payment_links DROP COLUMN IF EXISTS invoice_id;

-- Step 2: Add a label column for user-friendly naming of payment links
ALTER TABLE public.payment_links ADD COLUMN IF NOT EXISTS label text NOT NULL DEFAULT 'Payment Link';

-- Step 3: Ensure invoices table has payment_link_id (it already exists based on schema, but let's make sure it's properly set up)
-- The payment_link_id column already exists in invoices table as nullable, which is correct

-- Step 4: Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_links_user_id ON public.payment_links(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_is_default ON public.payment_links(user_id, is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_invoices_payment_link_id ON public.invoices(payment_link_id);
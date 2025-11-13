-- Create table to track renewal reminder emails
CREATE TABLE IF NOT EXISTS public.renewal_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('essential', 'premium')),
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'annual')),
  renewal_date TIMESTAMPTZ NOT NULL,
  reminder_sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.renewal_reminders ENABLE ROW LEVEL SECURITY;

-- Users can view their own reminders
CREATE POLICY "Users can view their own renewal reminders"
  ON public.renewal_reminders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create index for efficient queries
CREATE INDEX idx_renewal_reminders_user_id ON public.renewal_reminders(user_id);
CREATE INDEX idx_renewal_reminders_renewal_date ON public.renewal_reminders(renewal_date);

-- Add subscription metadata to profiles table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'subscription_renewal_date') THEN
    ALTER TABLE public.profiles 
    ADD COLUMN subscription_renewal_date TIMESTAMPTZ;
  END IF;
END $$;
-- Create email sequence progress table
CREATE TABLE public.email_sequence_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sequence_type TEXT NOT NULL DEFAULT 'onboarding', -- 'onboarding', 'habit', 'conversion', 'dormant'
  current_day INTEGER NOT NULL DEFAULT 0,
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  next_email_due_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, sequence_type)
);

-- Create email send log for tracking
CREATE TABLE public.email_send_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sequence_type TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  email_subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'failed', 'opened', 'clicked'
  error_message TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.email_sequence_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;

-- RLS policies - users can view their own progress
CREATE POLICY "Users can view own email sequence progress"
  ON public.email_sequence_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own email logs"
  ON public.email_send_log
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all (for edge functions)
CREATE POLICY "Service role can manage email sequences"
  ON public.email_sequence_progress
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage email logs"
  ON public.email_send_log
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_email_sequence_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_email_sequence_progress_updated_at
  BEFORE UPDATE ON public.email_sequence_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_email_sequence_updated_at();

-- Function to initialize email sequences for new users
CREATE OR REPLACE FUNCTION public.initialize_email_sequences()
RETURNS TRIGGER AS $$
BEGIN
  -- Start onboarding sequence immediately
  INSERT INTO public.email_sequence_progress (user_id, sequence_type, current_day, next_email_due_at)
  VALUES (NEW.id, 'onboarding', 0, now())
  ON CONFLICT DO NOTHING;
  
  -- Start habit sequence (Day 1)
  INSERT INTO public.email_sequence_progress (user_id, sequence_type, current_day, next_email_due_at)
  VALUES (NEW.id, 'habit', 0, now() + interval '1 day')
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to start sequences on profile creation
CREATE TRIGGER start_email_sequences_on_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_email_sequences();

-- Index for efficient querying
CREATE INDEX idx_email_sequence_next_due ON public.email_sequence_progress(next_email_due_at) WHERE is_active = true;
CREATE INDEX idx_email_sequence_user ON public.email_sequence_progress(user_id);
CREATE INDEX idx_email_send_log_user ON public.email_send_log(user_id, sent_at DESC);
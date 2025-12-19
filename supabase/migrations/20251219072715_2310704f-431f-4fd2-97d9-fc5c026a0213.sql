-- Create early_landings table for tracking visitors before React loads
-- This captures true bounces that happen before the SPA mounts
CREATE TABLE public.early_landings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  landing_page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  screen_width INTEGER,
  is_mobile BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Track if the session later converted (user engaged)
  converted BOOLEAN DEFAULT false,
  converted_at TIMESTAMP WITH TIME ZONE
);

-- Index for analytics queries
CREATE INDEX idx_early_landings_created_at ON public.early_landings(created_at DESC);
CREATE INDEX idx_early_landings_session_id ON public.early_landings(session_id);
CREATE INDEX idx_early_landings_landing_page ON public.early_landings(landing_page);

-- Enable RLS (public write via edge function, no public read)
ALTER TABLE public.early_landings ENABLE ROW LEVEL SECURITY;

-- Allow insert from edge function (uses service role key)
-- No public policies needed as edge function uses service role
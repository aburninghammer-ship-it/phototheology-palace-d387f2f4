-- Drop existing challenge constraints and add new challenge type structure
ALTER TABLE public.challenges DROP CONSTRAINT IF EXISTS challenges_challenge_type_check;

-- Update challenges table to support new challenge types and structure
ALTER TABLE public.challenges 
  ADD COLUMN IF NOT EXISTS challenge_tier TEXT CHECK (challenge_tier IN ('Quick', 'Core', 'Advance')),
  ADD COLUMN IF NOT EXISTS challenge_subtype TEXT,
  ADD COLUMN IF NOT EXISTS principle_used TEXT,
  ADD COLUMN IF NOT EXISTS room_codes TEXT[],
  ADD COLUMN IF NOT EXISTS instructions JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS ui_config JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS day_in_rotation INTEGER;

-- Update challenge_type to support new types
ALTER TABLE public.challenges 
  ADD CONSTRAINT challenges_challenge_type_check 
  CHECK (challenge_type IN (
    'daily',
    'dimension-drill',
    'connect-6',
    'sanctuary-map',
    'time-zone',
    'christ-chapter',
    'prophecy-pattern',
    'fruit-check',
    'chain-build',
    'house-fire',
    'fps-frame',
    'theme-wall',
    'counterfeit-spot',
    'prophecy'
  ));

-- Update challenge_submissions to store structured answers
ALTER TABLE public.challenge_submissions
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS submission_data JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS principle_applied TEXT,
  ADD COLUMN IF NOT EXISTS time_spent INTEGER;

-- Create index for faster lookups by challenge type
CREATE INDEX IF NOT EXISTS idx_challenges_subtype ON public.challenges(challenge_subtype);
CREATE INDEX IF NOT EXISTS idx_challenges_rotation ON public.challenges(day_in_rotation);

-- Create growth journal view for users
CREATE OR REPLACE VIEW public.user_growth_journal AS
SELECT 
  cs.id,
  cs.user_id,
  cs.challenge_id,
  cs.created_at,
  cs.content,
  cs.submission_data,
  cs.principle_applied,
  cs.time_spent,
  c.title as challenge_title,
  c.challenge_type,
  c.challenge_subtype,
  c.challenge_tier,
  c.principle_used,
  c.room_codes
FROM public.challenge_submissions cs
JOIN public.challenges c ON cs.challenge_id = c.id
ORDER BY cs.created_at DESC;

-- Grant access to growth journal view
GRANT SELECT ON public.user_growth_journal TO authenticated;

-- Add RLS policy for growth journal
CREATE POLICY "Users can view their own growth journal"
  ON public.challenge_submissions
  FOR SELECT
  USING (auth.uid() = user_id);
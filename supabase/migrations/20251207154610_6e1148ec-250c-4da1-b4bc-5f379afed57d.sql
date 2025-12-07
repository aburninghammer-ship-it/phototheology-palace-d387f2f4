-- First, add new columns to existing study_sessions table
ALTER TABLE public.study_sessions 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS share_token TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ADD COLUMN IF NOT EXISTS last_auto_save_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ADD COLUMN IF NOT EXISTS saved_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS total_duration_seconds INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS ai_summary_generated_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS session_state JSONB DEFAULT '{}'::jsonb;

-- Add constraint on status
ALTER TABLE public.study_sessions DROP CONSTRAINT IF EXISTS study_sessions_status_check;
ALTER TABLE public.study_sessions ADD CONSTRAINT study_sessions_status_check 
  CHECK (status IS NULL OR status IN ('draft', 'saved', 'archived'));

-- Add unique constraint on share_token
ALTER TABLE public.study_sessions DROP CONSTRAINT IF EXISTS study_sessions_share_token_key;
ALTER TABLE public.study_sessions ADD CONSTRAINT study_sessions_share_token_key UNIQUE (share_token);
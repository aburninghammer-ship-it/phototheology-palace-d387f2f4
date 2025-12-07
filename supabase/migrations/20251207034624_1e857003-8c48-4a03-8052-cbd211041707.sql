-- Create study_sessions table for multi-tab study sessions
CREATE TABLE public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tabs_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  jeeves_context JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_opened_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sessions"
ON public.study_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
ON public.study_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
ON public.study_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
ON public.study_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX idx_study_sessions_updated_at ON public.study_sessions(updated_at DESC);

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_study_sessions_updated_at
BEFORE UPDATE ON public.study_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Create sparks table for storing generated discovery sparks
CREATE TABLE public.sparks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  surface TEXT NOT NULL CHECK (surface IN ('notes', 'verse', 'study', 'session', 'other')),
  context_type TEXT NOT NULL CHECK (context_type IN ('verse', 'note_block', 'gem', 'session', 'study')),
  context_id TEXT NOT NULL,
  spark_type TEXT NOT NULL CHECK (spark_type IN ('connection', 'pattern', 'application')),
  title TEXT NOT NULL,
  recognition TEXT NOT NULL,
  insight TEXT NOT NULL,
  explore_action JSONB,
  confidence NUMERIC(3,2) DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  novelty_score NUMERIC(3,2) DEFAULT 0.5 CHECK (novelty_score >= 0 AND novelty_score <= 1),
  content_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  opened_at TIMESTAMP WITH TIME ZONE,
  saved_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE
);

-- Create spark_preferences table for user settings
CREATE TABLE public.spark_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  intensity TEXT NOT NULL DEFAULT 'normal' CHECK (intensity IN ('off', 'subtle', 'normal', 'rich')),
  mode TEXT NOT NULL DEFAULT 'standard' CHECK (mode IN ('beginner', 'standard', 'master')),
  auto_open BOOLEAN NOT NULL DEFAULT false,
  only_after_save BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create spark_events table for analytics tracking
CREATE TABLE public.spark_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  spark_id UUID REFERENCES public.sparks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('generated', 'shown', 'opened', 'explored', 'saved', 'dismissed')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.sparks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spark_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spark_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for sparks
CREATE POLICY "Users can view their own sparks"
ON public.sparks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sparks"
ON public.sparks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sparks"
ON public.sparks FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sparks"
ON public.sparks FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for spark_preferences
CREATE POLICY "Users can view their own spark preferences"
ON public.spark_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own spark preferences"
ON public.spark_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own spark preferences"
ON public.spark_preferences FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for spark_events
CREATE POLICY "Users can view their own spark events"
ON public.spark_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own spark events"
ON public.spark_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_sparks_user_id ON public.sparks(user_id);
CREATE INDEX idx_sparks_context ON public.sparks(context_type, context_id);
CREATE INDEX idx_sparks_content_hash ON public.sparks(content_hash);
CREATE INDEX idx_sparks_created_at ON public.sparks(created_at DESC);
CREATE INDEX idx_spark_events_user_id ON public.spark_events(user_id);
CREATE INDEX idx_spark_events_spark_id ON public.spark_events(spark_id);

-- Trigger for updating spark_preferences updated_at
CREATE TRIGGER update_spark_preferences_updated_at
BEFORE UPDATE ON public.spark_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
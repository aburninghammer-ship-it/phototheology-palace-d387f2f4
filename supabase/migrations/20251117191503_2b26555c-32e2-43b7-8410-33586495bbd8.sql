-- Create sermon_titles table for storing sermon title ideas
CREATE TABLE IF NOT EXISTS public.sermon_titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scripture_references TEXT[],
  tags TEXT[],
  is_ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sermon_titles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own sermon titles"
  ON public.sermon_titles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sermon titles"
  ON public.sermon_titles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sermon titles"
  ON public.sermon_titles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sermon titles"
  ON public.sermon_titles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_sermon_titles_user_id ON public.sermon_titles(user_id);
CREATE INDEX idx_sermon_titles_created_at ON public.sermon_titles(created_at DESC);
-- Create table for tracking mental health blueprint progress
CREATE TABLE IF NOT EXISTS public.mental_health_blueprint_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable RLS
ALTER TABLE public.mental_health_blueprint_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own progress"
  ON public.mental_health_blueprint_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.mental_health_blueprint_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.mental_health_blueprint_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_mental_health_blueprint_progress_updated_at
  BEFORE UPDATE ON public.mental_health_blueprint_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_mental_health_blueprint_progress_user_id ON public.mental_health_blueprint_progress(user_id);
CREATE INDEX idx_mental_health_blueprint_progress_article_id ON public.mental_health_blueprint_progress(article_id);
-- Table for tracking user progress through series lessons
CREATE TABLE public.bible_study_series_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  series_id UUID NOT NULL REFERENCES public.bible_study_series(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.bible_study_lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Table for users enrolling/following series
CREATE TABLE public.bible_study_series_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  series_id UUID NOT NULL REFERENCES public.bible_study_series(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, series_id)
);

-- Enable RLS
ALTER TABLE public.bible_study_series_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_study_series_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS policies for progress
CREATE POLICY "Users can view their own progress" 
ON public.bible_study_series_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.bible_study_series_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.bible_study_series_progress FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" 
ON public.bible_study_series_progress FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for enrollments
CREATE POLICY "Users can view their own enrollments" 
ON public.bible_study_series_enrollments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments" 
ON public.bible_study_series_enrollments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" 
ON public.bible_study_series_enrollments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own enrollments" 
ON public.bible_study_series_enrollments FOR DELETE 
USING (auth.uid() = user_id);

-- Add share_token to bible_study_series for sharing
ALTER TABLE public.bible_study_series 
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Policy for viewing public series
CREATE POLICY "Anyone can view public series" 
ON public.bible_study_series FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);
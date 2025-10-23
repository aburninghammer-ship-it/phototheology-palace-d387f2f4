-- Create table for user's memorization verses
CREATE TABLE public.memorization_verses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  verse_text TEXT NOT NULL,
  verse_reference TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  review_count INTEGER NOT NULL DEFAULT 0,
  mastery_level INTEGER NOT NULL DEFAULT 0,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.memorization_verses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own memorization verses"
  ON public.memorization_verses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memorization verses"
  ON public.memorization_verses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memorization verses"
  ON public.memorization_verses
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memorization verses"
  ON public.memorization_verses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_memorization_verses_user_id ON public.memorization_verses(user_id);
CREATE INDEX idx_memorization_verses_reference ON public.memorization_verses(book, chapter, verse);
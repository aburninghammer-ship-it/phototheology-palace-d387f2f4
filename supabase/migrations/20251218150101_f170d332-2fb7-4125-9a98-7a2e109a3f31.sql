-- Create personal devotional diary table
CREATE TABLE public.personal_devotional_diary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  scripture_reference TEXT,
  reflection TEXT NOT NULL,
  prayer_points TEXT[],
  gratitude_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

-- Enable RLS
ALTER TABLE public.personal_devotional_diary ENABLE ROW LEVEL SECURITY;

-- Users can only access their own diary entries
CREATE POLICY "Users can view their own diary entries"
  ON public.personal_devotional_diary
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diary entries"
  ON public.personal_devotional_diary
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary entries"
  ON public.personal_devotional_diary
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diary entries"
  ON public.personal_devotional_diary
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_personal_devotional_diary_updated_at
  BEFORE UPDATE ON public.personal_devotional_diary
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_personal_devotional_diary_user_date ON public.personal_devotional_diary(user_id, entry_date DESC);
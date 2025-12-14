-- Add devotional_text column for essay-style flowing paragraphs
ALTER TABLE public.devotional_days 
ADD COLUMN IF NOT EXISTS devotional_text text;
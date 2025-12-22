-- Create a table to store all generated gems globally for uniqueness checking
CREATE TABLE public.generated_gems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_hash TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  generated_for_user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.generated_gems ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read gems (for uniqueness checking)
CREATE POLICY "Anyone can read generated gems"
ON public.generated_gems
FOR SELECT
USING (true);

-- Allow service role to insert (edge function)
CREATE POLICY "Service role can insert gems"
ON public.generated_gems
FOR INSERT
WITH CHECK (true);

-- Create index on content_hash for fast lookups
CREATE INDEX idx_generated_gems_content_hash ON public.generated_gems(content_hash);
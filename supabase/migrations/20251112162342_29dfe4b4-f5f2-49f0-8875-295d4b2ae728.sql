-- Create user_studies table for personal Bible study notes
CREATE TABLE IF NOT EXISTS public.user_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Study',
  content TEXT DEFAULT '',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_studies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own studies"
  ON public.user_studies
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own studies"
  ON public.user_studies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own studies"
  ON public.user_studies
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own studies"
  ON public.user_studies
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_user_studies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_studies_updated_at
  BEFORE UPDATE ON public.user_studies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_studies_updated_at();

-- Create index for faster queries
CREATE INDEX idx_user_studies_user_id ON public.user_studies(user_id);
CREATE INDEX idx_user_studies_created_at ON public.user_studies(created_at DESC);
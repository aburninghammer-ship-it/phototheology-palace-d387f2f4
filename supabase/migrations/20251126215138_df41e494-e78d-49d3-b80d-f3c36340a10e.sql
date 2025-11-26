-- Create table for storing Bible verse gems (connections between 3 unlikely verses)
CREATE TABLE IF NOT EXISTS public.gems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  verse1 TEXT NOT NULL,
  verse2 TEXT NOT NULL,
  verse3 TEXT NOT NULL,
  connection_explanation TEXT NOT NULL,
  principle_codes TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gems ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gems
CREATE POLICY "Users can view their own gems"
  ON public.gems
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own gems"
  ON public.gems
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gems"
  ON public.gems
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gems"
  ON public.gems
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_gems_user_id ON public.gems(user_id);
CREATE INDEX idx_gems_created_at ON public.gems(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_gems_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gems_timestamp
  BEFORE UPDATE ON public.gems
  FOR EACH ROW
  EXECUTE FUNCTION update_gems_updated_at();
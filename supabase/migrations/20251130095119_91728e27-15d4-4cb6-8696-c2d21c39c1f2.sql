-- Create user_reading_presets table for custom presets
CREATE TABLE public.user_reading_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  room_tags TEXT[] DEFAULT '{}',
  items JSONB NOT NULL DEFAULT '[]',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_reading_presets ENABLE ROW LEVEL SECURITY;

-- Users can view their own presets and public presets
CREATE POLICY "Users can view own and public presets"
ON public.user_reading_presets
FOR SELECT
USING (auth.uid() = user_id OR is_public = true);

-- Users can create their own presets
CREATE POLICY "Users can create own presets"
ON public.user_reading_presets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own presets
CREATE POLICY "Users can update own presets"
ON public.user_reading_presets
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own presets
CREATE POLICY "Users can delete own presets"
ON public.user_reading_presets
FOR DELETE
USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_user_reading_presets_updated_at
BEFORE UPDATE ON public.user_reading_presets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
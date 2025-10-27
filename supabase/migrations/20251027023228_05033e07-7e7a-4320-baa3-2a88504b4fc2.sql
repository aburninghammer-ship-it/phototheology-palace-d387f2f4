-- Create user_gems table for storing user-created gems
CREATE TABLE public.user_gems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gem_name TEXT NOT NULL,
  gem_content TEXT NOT NULL,
  room_id TEXT NOT NULL,
  floor_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_gems ENABLE ROW LEVEL SECURITY;

-- Users can view their own gems
CREATE POLICY "Users can view their own gems"
  ON public.user_gems
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own gems
CREATE POLICY "Users can create their own gems"
  ON public.user_gems
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own gems
CREATE POLICY "Users can update their own gems"
  ON public.user_gems
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own gems
CREATE POLICY "Users can delete their own gems"
  ON public.user_gems
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX idx_user_gems_user_room ON public.user_gems(user_id, room_id, floor_number);

-- Add trigger for updated_at
CREATE TRIGGER update_user_gems_updated_at
  BEFORE UPDATE ON public.user_gems
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
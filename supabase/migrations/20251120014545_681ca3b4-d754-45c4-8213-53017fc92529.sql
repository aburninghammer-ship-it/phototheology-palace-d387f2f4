-- Create prayer_requests table
CREATE TABLE public.prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_answered BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT true,
  prayer_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can create their own prayer requests"
  ON public.prayer_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view public prayer requests"
  ON public.prayer_requests
  FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer requests"
  ON public.prayer_requests
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayer requests"
  ON public.prayer_requests
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create prayer_interactions table to track who prayed
CREATE TABLE public.prayer_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_request_id UUID NOT NULL REFERENCES public.prayer_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(prayer_request_id, user_id)
);

-- Enable RLS
ALTER TABLE public.prayer_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interactions
CREATE POLICY "Users can create their own prayer interactions"
  ON public.prayer_interactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view prayer interactions"
  ON public.prayer_interactions
  FOR SELECT
  USING (true);

-- Create function to increment prayer count
CREATE OR REPLACE FUNCTION increment_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.prayer_requests
  SET prayer_count = prayer_count + 1
  WHERE id = NEW.prayer_request_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for incrementing prayer count
CREATE TRIGGER on_prayer_interaction_created
  AFTER INSERT ON public.prayer_interactions
  FOR EACH ROW
  EXECUTE FUNCTION increment_prayer_count();
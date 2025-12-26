-- Create room_content_updates table to track when rooms are renovated
CREATE TABLE public.room_content_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL,
  floor_number INTEGER NOT NULL,
  update_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.room_content_updates ENABLE ROW LEVEL SECURITY;

-- Everyone can read room updates
CREATE POLICY "Anyone can view room updates"
ON public.room_content_updates
FOR SELECT
USING (true);

-- Only admins can insert updates
CREATE POLICY "Admins can insert room updates"
ON public.room_content_updates
FOR INSERT
WITH CHECK (public.is_admin_user(auth.uid()));

-- Create user_room_visits table to track when users visit renovated rooms
CREATE TABLE public.user_room_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL,
  last_visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, room_id)
);

-- Enable RLS
ALTER TABLE public.user_room_visits ENABLE ROW LEVEL SECURITY;

-- Users can view their own visits
CREATE POLICY "Users can view own room visits"
ON public.user_room_visits
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert/update their own visits
CREATE POLICY "Users can upsert own room visits"
ON public.user_room_visits
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own room visits"
ON public.user_room_visits
FOR UPDATE
USING (auth.uid() = user_id);

-- Function to check if a room has new content since user's last visit
CREATE OR REPLACE FUNCTION public.is_room_newly_renovated(_user_id UUID, _room_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.room_content_updates rcu
    WHERE rcu.room_id = _room_id
    AND rcu.created_at > COALESCE(
      (SELECT last_visited_at FROM public.user_room_visits 
       WHERE user_id = _user_id AND room_id = _room_id),
      '1970-01-01'::timestamptz
    )
  );
$$;

-- Function to mark a room as visited
CREATE OR REPLACE FUNCTION public.mark_room_visited(_user_id UUID, _room_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_room_visits (user_id, room_id, last_visited_at)
  VALUES (_user_id, _room_id, now())
  ON CONFLICT (user_id, room_id)
  DO UPDATE SET last_visited_at = now();
END;
$$;
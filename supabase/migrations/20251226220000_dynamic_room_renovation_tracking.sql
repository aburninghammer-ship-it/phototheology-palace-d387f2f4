-- Dynamic Room Renovation Tracking System
-- Replaces static renovatedRooms.ts config with database-driven approach

-- Table to track when rooms are updated/modified
CREATE TABLE IF NOT EXISTS public.room_content_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL,
  floor_number INTEGER NOT NULL CHECK (floor_number >= 1 AND floor_number <= 8),
  update_description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table to track when users visit/view rooms
CREATE TABLE IF NOT EXISTS public.user_room_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL,
  floor_number INTEGER NOT NULL CHECK (floor_number >= 1 AND floor_number <= 8),
  first_visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  visit_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, room_id, floor_number)
);

-- Enable RLS
ALTER TABLE public.room_content_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_room_visits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for room_content_updates
CREATE POLICY "Anyone can view room updates"
ON public.room_content_updates FOR SELECT
USING (true);

CREATE POLICY "Admins can manage room updates"
ON public.room_content_updates FOR ALL
USING (public.is_palace_owner(auth.uid()));

-- RLS Policies for user_room_visits
CREATE POLICY "Users can view own room visits"
ON public.user_room_visits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own room visits"
ON public.user_room_visits FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own room visits"
ON public.user_room_visits FOR UPDATE
USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_room_updates_room ON public.room_content_updates(room_id, floor_number);
CREATE INDEX idx_room_updates_time ON public.room_content_updates(updated_at DESC);
CREATE INDEX idx_user_visits_user ON public.user_room_visits(user_id);
CREATE INDEX idx_user_visits_room ON public.user_room_visits(room_id, floor_number);

-- Function to check if a room has been updated since user's last visit
CREATE OR REPLACE FUNCTION public.is_room_newly_renovated(
  p_user_id UUID,
  p_room_id TEXT,
  p_floor_number INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_update TIMESTAMPTZ;
  v_last_visit TIMESTAMPTZ;
BEGIN
  -- Get the most recent update for this room
  SELECT MAX(updated_at) INTO v_last_update
  FROM room_content_updates
  WHERE room_id = p_room_id AND floor_number = p_floor_number;

  -- If no updates recorded, room is not newly renovated
  IF v_last_update IS NULL THEN
    RETURN false;
  END IF;

  -- Get user's last visit to this room
  SELECT last_visited_at INTO v_last_visit
  FROM user_room_visits
  WHERE user_id = p_user_id
    AND room_id = p_room_id
    AND floor_number = p_floor_number;

  -- If never visited, it's newly renovated
  IF v_last_visit IS NULL THEN
    RETURN true;
  END IF;

  -- Compare: is last update after last visit?
  RETURN v_last_update > v_last_visit;
END;
$$;

-- Function to mark a room as visited (upsert)
CREATE OR REPLACE FUNCTION public.mark_room_visited(
  p_user_id UUID,
  p_room_id TEXT,
  p_floor_number INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_room_visits (user_id, room_id, floor_number, last_visited_at, visit_count)
  VALUES (p_user_id, p_room_id, p_floor_number, NOW(), 1)
  ON CONFLICT (user_id, room_id, floor_number)
  DO UPDATE SET
    last_visited_at = NOW(),
    visit_count = user_room_visits.visit_count + 1;
END;
$$;

-- Migrate existing static data from renovatedRooms.ts
-- Insert updates for rooms that are currently marked as renovated
INSERT INTO public.room_content_updates (room_id, floor_number, update_description, updated_at)
VALUES
  ('sr', 1, 'Initial migration from static config', NOW() - INTERVAL '7 days'),
  ('24fps', 1, 'Initial migration from static config', NOW() - INTERVAL '7 days'),
  ('ir', 1, 'Initial migration from static config', NOW() - INTERVAL '7 days'),
  ('tr', 1, 'Initial migration from static config', NOW() - INTERVAL '7 days'),
  ('gr', 1, 'Initial migration from static config', NOW() - INTERVAL '7 days'),
  ('or', 2, 'Initial migration from static config', NOW() - INTERVAL '7 days'),
  ('dc', 2, 'Initial migration from static config', NOW() - INTERVAL '7 days'),
  ('st', 2, 'Initial migration from static config', NOW() - INTERVAL '7 days'),
  ('fe', 5, 'Initial migration from static config', NOW() - INTERVAL '7 days'),
  ('bl', 5, 'Initial migration from static config', NOW() - INTERVAL '7 days'),
  ('123h', 6, 'Initial migration from static config', NOW() - INTERVAL '7 days'),
  ('math', 6, 'Initial migration from static config', NOW() - INTERVAL '7 days')
ON CONFLICT DO NOTHING;

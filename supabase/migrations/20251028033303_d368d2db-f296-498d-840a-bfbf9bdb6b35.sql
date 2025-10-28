-- Create table for room practice/exercise work
CREATE TABLE IF NOT EXISTS public.room_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  floor_number INTEGER NOT NULL,
  room_id TEXT NOT NULL,
  verse_reference TEXT NOT NULL,
  exercise_title TEXT NOT NULL,
  exercise_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.room_exercises ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own exercises"
  ON public.room_exercises
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercises"
  ON public.room_exercises
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercises"
  ON public.room_exercises
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercises"
  ON public.room_exercises
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_room_exercises_user_room ON public.room_exercises(user_id, floor_number, room_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_room_exercises_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER room_exercises_updated_at
  BEFORE UPDATE ON public.room_exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_room_exercises_updated_at();
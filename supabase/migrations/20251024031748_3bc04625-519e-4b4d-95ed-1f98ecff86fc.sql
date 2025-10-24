-- Create user_achievements table if not exists
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock achievements"
  ON public.user_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);

-- Insert initial achievements
INSERT INTO public.achievements (name, description, icon, points, requirement_type, requirement_count) VALUES
  ('First Steps', 'Complete your first room', '🚀', 10, 'rooms_completed', 1),
  ('Dedicated Student', 'Complete 10 rooms', '📚', 50, 'rooms_completed', 10),
  ('Palace Master', 'Complete 50 rooms', '👑', 200, 'rooms_completed', 50),
  ('Floor Explorer', 'Complete all rooms on one floor', '🏛️', 100, 'floors_completed', 1),
  ('Drill Beginner', 'Complete your first practice drill', '⚡', 10, 'drills_completed', 1),
  ('Practice Makes Perfect', 'Complete 25 practice drills', '💪', 75, 'drills_completed', 25),
  ('Perfectionist', 'Get a perfect score on 5 drills', '⭐', 100, 'perfect_drills', 5),
  ('Consistent Learner', 'Maintain a 7-day study streak', '🔥', 50, 'study_streak', 7),
  ('Streak Champion', 'Maintain a 30-day study streak', '🏆', 300, 'study_streak', 30)
ON CONFLICT DO NOTHING;

-- Function to increment user points
CREATE OR REPLACE FUNCTION public.increment_user_points(user_id UUID, points_to_add INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET points = COALESCE(points, 0) + points_to_add
  WHERE id = user_id;
END;
$$;
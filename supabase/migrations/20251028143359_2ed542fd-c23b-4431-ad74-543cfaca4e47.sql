-- Add foreign key relationship between game_scores and profiles
ALTER TABLE public.game_scores 
  ADD CONSTRAINT fk_game_scores_profiles 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;
-- Add Change Spine tracking columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS has_completed_orientation boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS orientation_completed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS has_achieved_first_win boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS first_win_achieved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS first_win_type text,
ADD COLUMN IF NOT EXISTS total_sessions_completed integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_studies_saved integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_gems_saved integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS days_active integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date date,
ADD COLUMN IF NOT EXISTS change_phase text DEFAULT 'orientation',
ADD COLUMN IF NOT EXISTS guided_path_step integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS guided_path_completed_at timestamp with time zone;

-- Add index for change management queries
CREATE INDEX IF NOT EXISTS idx_profiles_change_phase ON public.profiles(change_phase);
CREATE INDEX IF NOT EXISTS idx_profiles_has_first_win ON public.profiles(has_achieved_first_win);

-- Create function to track gem saves and mark first win
CREATE OR REPLACE FUNCTION public.track_gem_save_and_first_win()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Increment gem count
  UPDATE public.profiles
  SET 
    total_gems_saved = COALESCE(total_gems_saved, 0) + 1,
    -- Mark first win if not already achieved
    has_achieved_first_win = CASE 
      WHEN COALESCE(has_achieved_first_win, false) = false THEN true 
      ELSE has_achieved_first_win 
    END,
    first_win_achieved_at = CASE 
      WHEN COALESCE(has_achieved_first_win, false) = false THEN NOW() 
      ELSE first_win_achieved_at 
    END,
    first_win_type = CASE 
      WHEN COALESCE(has_achieved_first_win, false) = false THEN 'gem_saved' 
      ELSE first_win_type 
    END,
    change_phase = CASE 
      WHEN change_phase = 'first_win' AND COALESCE(has_achieved_first_win, false) = false THEN 'reinforcement'
      ELSE change_phase 
    END,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger for gem saves
DROP TRIGGER IF EXISTS trigger_track_gem_save ON public.user_gems;
CREATE TRIGGER trigger_track_gem_save
  AFTER INSERT ON public.user_gems
  FOR EACH ROW
  EXECUTE FUNCTION public.track_gem_save_and_first_win();

-- Create function to update daily activity tracking
CREATE OR REPLACE FUNCTION public.update_daily_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    -- Increment days_active if this is a new day
    days_active = CASE 
      WHEN COALESCE(last_activity_date, '1900-01-01') < CURRENT_DATE THEN COALESCE(days_active, 0) + 1
      ELSE days_active
    END,
    last_activity_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger on deck_studies (study sessions) for activity tracking
DROP TRIGGER IF EXISTS trigger_update_activity_on_study ON public.deck_studies;
CREATE TRIGGER trigger_update_activity_on_study
  AFTER INSERT ON public.deck_studies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_daily_activity();
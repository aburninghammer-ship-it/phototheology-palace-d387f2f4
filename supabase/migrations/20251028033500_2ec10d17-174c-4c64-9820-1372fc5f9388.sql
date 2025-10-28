-- Fix the function to set search_path for security
DROP TRIGGER IF EXISTS room_exercises_updated_at ON public.room_exercises;
DROP FUNCTION IF EXISTS update_room_exercises_updated_at();

CREATE OR REPLACE FUNCTION update_room_exercises_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Re-create the trigger
CREATE TRIGGER room_exercises_updated_at
  BEFORE UPDATE ON public.room_exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_room_exercises_updated_at();
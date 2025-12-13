-- Update the function to count ALL registered users (total profiles)
-- This gives a more accurate "users & counting" number
CREATE OR REPLACE FUNCTION public.get_active_user_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COUNT(*)::integer 
  FROM profiles;
$$;
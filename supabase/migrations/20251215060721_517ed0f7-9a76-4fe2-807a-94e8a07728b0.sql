-- Update function to count ALL users since app inception
CREATE OR REPLACE FUNCTION get_active_user_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM profiles;
$$;
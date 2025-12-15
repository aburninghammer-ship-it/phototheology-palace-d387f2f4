-- Drop and recreate the function with SECURITY DEFINER to bypass RLS
DROP FUNCTION IF EXISTS get_active_user_count();

CREATE OR REPLACE FUNCTION get_active_user_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer 
  FROM profiles
  WHERE last_seen > now() - interval '30 days';
$$;
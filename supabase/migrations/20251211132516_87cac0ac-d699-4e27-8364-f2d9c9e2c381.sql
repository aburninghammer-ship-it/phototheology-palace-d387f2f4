-- Create a secure function to get active user count that works for everyone
CREATE OR REPLACE FUNCTION public.get_active_user_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COUNT(*)::integer 
  FROM profiles 
  WHERE subscription_status = 'active' 
     OR subscription_status = 'trial' 
     OR has_lifetime_access = true;
$$;
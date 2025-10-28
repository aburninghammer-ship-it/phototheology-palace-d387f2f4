-- Fix function search_path for update_user_engagement
CREATE OR REPLACE FUNCTION public.update_user_engagement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_engagement (user_id, last_login_at, last_activity_at, total_sessions)
  VALUES (auth.uid(), NOW(), NOW(), 1)
  ON CONFLICT (user_id)
  DO UPDATE SET
    last_login_at = NOW(),
    last_activity_at = NOW(),
    total_sessions = user_engagement.total_sessions + 1,
    updated_at = NOW();
  RETURN NEW;
END;
$function$;
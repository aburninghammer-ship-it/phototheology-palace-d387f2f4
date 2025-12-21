-- Fix get_subscription_summary to properly detect expired trials
CREATE OR REPLACE FUNCTION public.get_subscription_summary(_user_id uuid DEFAULT auth.uid())
 RETURNS TABLE(status text, tier text, has_access boolean, trial_ends_at timestamp with time zone, renewal_date timestamp with time zone, has_lifetime boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow users to check their own subscription (or admins)
  IF _user_id != auth.uid() AND NOT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  RETURN QUERY
  SELECT 
    -- Return actual status, but override to 'expired' if trial has ended
    CASE 
      WHEN COALESCE(us.has_lifetime_access, false) THEN 'active'
      WHEN us.subscription_status = 'active' AND (us.subscription_renewal_date IS NULL OR us.subscription_renewal_date > NOW()) THEN 'active'
      WHEN us.subscription_status = 'trial' AND us.trial_ends_at IS NOT NULL AND us.trial_ends_at > NOW() THEN 'trial'
      WHEN us.promotional_access_expires_at IS NOT NULL AND us.promotional_access_expires_at > NOW() THEN 'active'
      ELSE 'expired'
    END::TEXT,
    COALESCE(us.subscription_tier, 'free')::TEXT,
    (
      COALESCE(us.has_lifetime_access, false) OR
      (us.subscription_status = 'active' AND (us.subscription_renewal_date IS NULL OR us.subscription_renewal_date > NOW())) OR
      (us.subscription_status = 'trial' AND us.trial_ends_at IS NOT NULL AND us.trial_ends_at > NOW()) OR
      (us.promotional_access_expires_at IS NOT NULL AND us.promotional_access_expires_at > NOW())
    )::BOOLEAN,
    us.trial_ends_at,
    us.subscription_renewal_date,
    COALESCE(us.has_lifetime_access, false)::BOOLEAN
  FROM public.user_subscriptions us
  WHERE us.user_id = _user_id;
END;
$$;
-- Update the trigger function to set 14-day trial instead of 7-day
CREATE OR REPLACE FUNCTION public.create_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (
    user_id,
    status,
    tier,
    trial_started_at,
    trial_ends_at
  ) VALUES (
    NEW.id,
    'trial',
    'premium',
    NOW(),
    NOW() + INTERVAL '14 days'
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;
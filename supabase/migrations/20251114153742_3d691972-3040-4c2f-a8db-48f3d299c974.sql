-- Fix handle_new_user to not fail on email notification errors
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  ref_code TEXT;
  incoming_ref_code TEXT;
BEGIN
  -- Generate unique referral code
  ref_code := generate_referral_code(NEW.id);
  
  -- Check for referral code in metadata
  incoming_ref_code := NEW.raw_user_meta_data->>'referral_code';
  
  -- Insert profile with trial
  INSERT INTO public.profiles (
    id, 
    username, 
    display_name, 
    referral_code,
    trial_started_at,
    trial_ends_at,
    subscription_status
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text from 1 for 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
    ref_code,
    NOW(),
    NOW() + INTERVAL '7 days',
    'trial'
  );
  
  -- Handle incoming referral
  IF incoming_ref_code IS NOT NULL THEN
    UPDATE public.referrals 
    SET 
      referred_user_id = NEW.id,
      status = 'signed_up'
    WHERE referral_code = incoming_ref_code AND status = 'pending';
  END IF;
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Try to send signup notification email, but don't fail if it errors
  BEGIN
    PERFORM net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/send-signup-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_anon_key')
      ),
      body := jsonb_build_object(
        'userEmail', NEW.email,
        'displayName', COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
        'userId', NEW.id::text
      )
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to send signup notification for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$function$;
-- Add access_duration_months column to special_access_codes
ALTER TABLE special_access_codes
ADD COLUMN IF NOT EXISTS access_duration_months integer;

-- Add promotional_access_expires_at to profiles for time-limited promotional access
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS promotional_access_expires_at timestamp with time zone;

-- Update the redeem_access_code function to support time-limited access
CREATE OR REPLACE FUNCTION public.redeem_access_code(access_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  code_record special_access_codes;
  user_id UUID;
  access_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current user
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Check if user already has lifetime access
  IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND has_lifetime_access = TRUE) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You already have lifetime access');
  END IF;
  
  -- Get the code record
  SELECT * INTO code_record
  FROM special_access_codes
  WHERE code = access_code
  FOR UPDATE;
  
  -- Validate code exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid access code');
  END IF;
  
  -- Validate code is active
  IF code_record.is_active = FALSE THEN
    RETURN jsonb_build_object('success', false, 'error', 'This code has been deactivated');
  END IF;
  
  -- Validate code hasn't expired
  IF code_record.expires_at < NOW() THEN
    RETURN jsonb_build_object('success', false, 'error', 'This code has expired');
  END IF;
  
  -- Validate max uses (if set)
  IF code_record.max_uses IS NOT NULL AND code_record.used_count >= code_record.max_uses THEN
    RETURN jsonb_build_object('success', false, 'error', 'This code has reached its maximum number of uses');
  END IF;
  
  -- Determine access type based on access_duration_months
  IF code_record.access_duration_months IS NULL THEN
    -- Grant lifetime access (existing behavior)
    UPDATE profiles
    SET 
      has_lifetime_access = TRUE,
      lifetime_access_granted_at = NOW(),
      access_code_used = access_code,
      subscription_status = 'active',
      subscription_tier = 'premium'
    WHERE id = user_id;
    
    -- Increment used count
    UPDATE special_access_codes
    SET used_count = used_count + 1
    WHERE code = access_code;
    
    RETURN jsonb_build_object('success', true, 'message', 'Lifetime access granted!');
  ELSE
    -- Grant time-limited promotional access
    access_expires_at := NOW() + (code_record.access_duration_months || ' months')::interval;
    
    UPDATE profiles
    SET 
      promotional_access_expires_at = access_expires_at,
      access_code_used = access_code,
      subscription_status = 'active',
      subscription_tier = 'premium'
    WHERE id = user_id;
    
    -- Increment used count
    UPDATE special_access_codes
    SET used_count = used_count + 1
    WHERE code = access_code;
    
    RETURN jsonb_build_object(
      'success', true, 
      'message', code_record.access_duration_months || ' months of premium access granted!',
      'expires_at', access_expires_at
    );
  END IF;
END;
$function$;
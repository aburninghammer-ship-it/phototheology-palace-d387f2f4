-- Create special access codes table
CREATE TABLE public.special_access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  max_uses INTEGER DEFAULT NULL, -- NULL means unlimited
  used_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Add lifetime access fields to profiles
ALTER TABLE public.profiles
ADD COLUMN has_lifetime_access BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN lifetime_access_granted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN access_code_used TEXT;

-- Enable RLS
ALTER TABLE public.special_access_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view codes
CREATE POLICY "Admins can view all codes"
ON public.special_access_codes
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can create codes
CREATE POLICY "Admins can create codes"
ON public.special_access_codes
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can update codes
CREATE POLICY "Admins can update codes"
ON public.special_access_codes
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Function to validate and redeem access code
CREATE OR REPLACE FUNCTION public.redeem_access_code(access_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code_record special_access_codes;
  user_id UUID;
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
  
  -- Grant lifetime access
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
END;
$$;
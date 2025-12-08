
-- Fix 1: Protect church billing data by restricting non-admin access

-- Drop the policy that allows regular members to view all church columns
DROP POLICY IF EXISTS "Church members can view basic church info" ON public.churches;

-- Enable RLS on the churches_public_info view (it's a view, need to create a function-based approach)
-- Instead, we'll create a secure function for non-admin access

-- Create a secure function for getting church public info
CREATE OR REPLACE FUNCTION public.get_church_public_info(_church_id uuid)
RETURNS TABLE(
  id uuid,
  name text,
  branded_name text,
  logo_url text,
  tier church_tier,
  max_seats integer,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id,
    c.name,
    c.branded_name,
    c.logo_url,
    c.tier,
    c.max_seats,
    c.created_at
  FROM public.churches c
  JOIN public.church_members cm ON cm.church_id = c.id
  WHERE c.id = _church_id AND cm.user_id = auth.uid()
$$;

-- Fix 2: Create a secure function for profile access that excludes sensitive fields
-- This addresses the enumeration concern by providing a safe accessor

CREATE OR REPLACE FUNCTION public.get_safe_profile(_user_id uuid)
RETURNS TABLE(
  id uuid,
  username text,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz,
  points integer,
  subscription_tier text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    p.bio,
    p.created_at,
    p.points,
    p.subscription_tier
  FROM public.profiles p
  WHERE p.id = _user_id
  -- Only allow users to get their own profile, or public profiles
  AND (p.id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = _user_id AND id = auth.uid()
  ))
$$;

-- Add a comment explaining the security model
COMMENT ON FUNCTION public.get_church_public_info IS 'Secure accessor for church info - excludes billing/sensitive data for non-admins';
COMMENT ON FUNCTION public.get_safe_profile IS 'Secure accessor for profile info - excludes Stripe IDs and other sensitive fields';

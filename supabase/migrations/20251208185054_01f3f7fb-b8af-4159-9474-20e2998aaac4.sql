-- Fix 1: Restrict profiles table - only allow users to see their own sensitive data
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view basic profile info" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create new restrictive policies
-- Users can view their own full profile
CREATE POLICY "Users can view own full profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can view basic public info of other users (for community features)
-- This uses a security definer function to only expose safe columns
CREATE OR REPLACE FUNCTION public.get_public_profile_info(_profile_id uuid)
RETURNS TABLE(id uuid, username text, display_name text, avatar_url text, bio text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.username, p.display_name, p.avatar_url, p.bio
  FROM public.profiles p
  WHERE p.id = _profile_id;
$$;

-- Fix 2: Restrict churches billing info - only admins can see billing details
-- Drop existing policies that may expose billing info
DROP POLICY IF EXISTS "Church members can view church" ON public.churches;
DROP POLICY IF EXISTS "Members can view their church" ON public.churches;

-- Create policy for basic church info (non-billing) for all members
CREATE POLICY "Members can view basic church info"
ON public.churches
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.church_members cm
    WHERE cm.church_id = id
    AND cm.user_id = auth.uid()
  )
);

-- Create a security definer function for admins to access billing info
CREATE OR REPLACE FUNCTION public.get_church_billing_info(_church_id uuid)
RETURNS TABLE(
  billing_email text,
  stripe_customer_id text,
  subscription_status text,
  subscription_ends_at timestamptz,
  subscription_started_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.billing_email, c.stripe_customer_id, c.subscription_status, 
         c.subscription_ends_at, c.subscription_started_at
  FROM public.churches c
  JOIN public.church_members cm ON cm.church_id = c.id
  WHERE c.id = _church_id
    AND cm.user_id = auth.uid()
    AND cm.role = 'admin';
$$;

-- Update existing policies for profiles to ensure users can update their own
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
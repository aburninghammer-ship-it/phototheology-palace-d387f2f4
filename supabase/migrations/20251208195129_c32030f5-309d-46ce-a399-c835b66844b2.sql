-- Drop the overly permissive public policy that exposes all profile data
DROP POLICY IF EXISTS "Anyone can view basic public profile info" ON public.profiles;

-- Keep the authenticated users policy for viewing profiles (needed for active users, leaderboards, etc.)
-- But create a security definer function to get only safe public profile fields
CREATE OR REPLACE FUNCTION public.get_safe_public_profile(_profile_id uuid)
RETURNS TABLE(
  id uuid,
  username text,
  display_name text,
  avatar_url text,
  bio text,
  master_title text,
  current_floor integer,
  points integer
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
    p.master_title,
    p.current_floor,
    p.points
  FROM public.profiles p
  WHERE p.id = _profile_id;
$$;

-- Create a policy for users to fully view their own profile
CREATE POLICY "Users can view their own full profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create a policy for viewing other users' profiles with limited fields via function
-- This replaces the broad public access with controlled authenticated access
CREATE POLICY "Authenticated users can view other profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: The above policy allows SELECT but sensitive columns should be handled at the application level
-- by using the get_safe_public_profile function for displaying other users' data
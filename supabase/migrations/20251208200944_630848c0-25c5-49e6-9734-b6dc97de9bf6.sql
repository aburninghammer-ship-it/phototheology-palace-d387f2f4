-- Drop the overly permissive SELECT policies that expose all profile data
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view other profiles" ON public.profiles;

-- Keep only the policy for users viewing their own full profile
-- "Users can view their own full profile" already exists with (auth.uid() = id)

-- For community features that need basic profile info (like displaying usernames),
-- applications should use the get_safe_public_profile function which only returns
-- non-sensitive fields: id, username, display_name, avatar_url, bio, master_title, current_floor, points

-- Fix profiles table security: remove overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view profiles for community features" ON public.profiles;

-- Create a more restrictive policy: users can only see their own profile OR 
-- view limited public profile info through the existing security definer function
-- The get_safe_public_profile function already exists for safe public access

-- Users can view their own full profile (already exists, but let's ensure it's correct)
-- The existing "Users can view their own full profile" policy handles this

-- For community features (viewing other users' profiles), they should use 
-- the get_safe_public_profile or get_public_profile functions instead of direct table access

-- Add policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  public.is_admin_user(auth.uid())
);

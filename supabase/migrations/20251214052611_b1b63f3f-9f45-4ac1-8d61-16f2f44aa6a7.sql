-- Fix: Allow authenticated users to view basic profile info for active users display
-- Drop the restrictive policy that only allows viewing own profile
DROP POLICY IF EXISTS "Users can only view their own profile" ON public.profiles;

-- Create a policy that allows authenticated users to view all profiles
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);
-- Drop the restrictive policy that only allows viewing own profile
DROP POLICY IF EXISTS "Users can only view own profile" ON public.profiles;

-- Create a new policy that allows authenticated users to view all profiles (for features like active users, leaderboards, etc.)
CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);
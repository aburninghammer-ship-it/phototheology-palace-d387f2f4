-- Add policy to allow all authenticated users to view basic profile info
CREATE POLICY "Authenticated users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Drop the restrictive policy that only allows viewing own profile
DROP POLICY IF EXISTS "Users can view own profile only" ON public.profiles;
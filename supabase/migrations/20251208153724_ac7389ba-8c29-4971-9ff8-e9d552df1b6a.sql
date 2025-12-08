-- Drop all existing SELECT policies on profiles to clean up redundancy
DROP POLICY IF EXISTS "Users can view own profile or admins can view all" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a single, secure SELECT policy that:
-- 1. Only allows authenticated users
-- 2. Users can only view their own profile
-- 3. Admins can view all profiles (using security definer function)
CREATE POLICY "Authenticated users can view own profile or admins view all"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (auth.uid() = id) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Ensure INSERT policy is also restricted to authenticated
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Authenticated users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Ensure UPDATE policy is also restricted to authenticated
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Authenticated users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
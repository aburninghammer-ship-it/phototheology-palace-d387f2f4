-- Fix 1: Profiles table - Users can only view their own profile (drop overly permissive policies)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

-- Create restrictive SELECT policy for profiles
CREATE POLICY "Users can only view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Fix 2: Patreon connections - ensure tokens are protected
DROP POLICY IF EXISTS "Anyone can view patreon connections" ON public.patreon_connections;
DROP POLICY IF EXISTS "Public can view patreon connections" ON public.patreon_connections;

-- Ensure only owner can access their patreon data
CREATE POLICY "Users can only view own patreon connection"
ON public.patreon_connections
FOR SELECT
USING (auth.uid() = user_id);
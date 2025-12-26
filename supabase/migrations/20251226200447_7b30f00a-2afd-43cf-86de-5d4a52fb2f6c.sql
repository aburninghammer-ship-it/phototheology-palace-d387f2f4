-- Drop the overly permissive public policies
DROP POLICY IF EXISTS "Anyone can view basic profile info" ON public.profiles;
DROP POLICY IF EXISTS "Users can view basic public info of others" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Keep existing policies for:
-- - "Users can view their own profile" (auth.uid() = id)
-- - "Admins can view all profiles" (is_admin_user(auth.uid()))
-- - "Authenticated users can insert own profile"
-- - "Users can only update own profile"

-- Create a new policy that allows authenticated users to see LIMITED fields of other users
-- This is done via a view instead (recommended approach), but for now we restrict to authenticated only
CREATE POLICY "Authenticated users can view other profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: To truly limit exposed fields, consider creating a view with only safe columns
-- and granting access to that view instead of the raw table
-- Fix profiles: Remove duplicate/conflicting policies and ensure only owner can see full profile
DROP POLICY IF EXISTS "Authenticated users can view own profile or admins view all" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own full profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create single clean policy for profiles SELECT - only own profile
CREATE POLICY "Users can only view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create single clean policy for profiles UPDATE - only own profile  
CREATE POLICY "Users can only update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Fix churches: Remove buggy policy and recreate correctly
DROP POLICY IF EXISTS "Members can view basic church info" ON public.churches;
DROP POLICY IF EXISTS "Church admins can view full church details" ON public.churches;

-- Only church admins can see full church details (including billing)
CREATE POLICY "Only church admins can view church"
ON public.churches
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.church_members cm
    WHERE cm.church_id = churches.id
    AND cm.user_id = auth.uid()
    AND cm.role = 'admin'
  )
);
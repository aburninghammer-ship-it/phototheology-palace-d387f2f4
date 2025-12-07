-- Drop the overly permissive policy that exposes all user roles
DROP POLICY IF EXISTS "User roles viewable by authenticated users" ON public.user_roles;

-- Create a secure policy where users can only see their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT TO authenticated USING (user_id = auth.uid());
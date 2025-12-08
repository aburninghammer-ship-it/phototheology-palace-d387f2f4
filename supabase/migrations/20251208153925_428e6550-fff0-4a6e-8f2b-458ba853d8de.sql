-- Drop the problematic view and recreate with SECURITY INVOKER
DROP VIEW IF EXISTS public.churches_public_info;

-- Recreate view with explicit SECURITY INVOKER (uses caller's permissions)
CREATE VIEW public.churches_public_info 
WITH (security_invoker = true)
AS
SELECT 
  id,
  name,
  branded_name,
  logo_url,
  tier,
  max_seats,
  created_at
FROM public.churches;

-- Grant access to the view for authenticated users
GRANT SELECT ON public.churches_public_info TO authenticated;

-- Add a policy that allows church members to view non-sensitive data via the view
-- This works because the view is security invoker, so it uses caller's permissions
CREATE POLICY "Church members can view basic church info"
ON public.churches
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM church_members
    WHERE church_members.church_id = churches.id
    AND church_members.user_id = auth.uid()
  )
);
-- Drop existing policies
DROP POLICY IF EXISTS "Church admins can view their church" ON public.churches;
DROP POLICY IF EXISTS "Church admins can update their church" ON public.churches;

-- Create a secure view for non-sensitive church data that members can access
CREATE OR REPLACE VIEW public.churches_public_info AS
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

-- Create policy for admins to view FULL church data (including billing)
CREATE POLICY "Church admins can view full church details"
ON public.churches
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM church_members
    WHERE church_members.church_id = churches.id
    AND church_members.user_id = auth.uid()
    AND church_members.role = 'admin'::church_member_role
  )
);

-- Create policy for admins to update their church
CREATE POLICY "Church admins can update their church"
ON public.churches
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM church_members
    WHERE church_members.church_id = churches.id
    AND church_members.user_id = auth.uid()
    AND church_members.role = 'admin'::church_member_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM church_members
    WHERE church_members.church_id = churches.id
    AND church_members.user_id = auth.uid()
    AND church_members.role = 'admin'::church_member_role
  )
);
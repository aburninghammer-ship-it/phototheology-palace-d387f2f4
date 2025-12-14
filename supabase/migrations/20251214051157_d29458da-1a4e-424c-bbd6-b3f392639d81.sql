-- Drop any existing policy first
DROP POLICY IF EXISTS "Users can check their own admin status" ON public.admin_users;

-- Create policy to allow users to check if they are an admin
CREATE POLICY "Users can check their own admin status"
ON public.admin_users
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
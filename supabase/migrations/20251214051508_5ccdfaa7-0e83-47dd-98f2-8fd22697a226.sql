-- Drop the old recursive policy that's causing issues
DROP POLICY IF EXISTS "Admins can view admin list" ON public.admin_users;
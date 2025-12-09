
-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Admins can update subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;

-- Create a security definer function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_admin_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = _user_id
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin'
  );
$$;

-- Create policies using the security definer function
CREATE POLICY "Admins can view all subscriptions" ON public.user_subscriptions
FOR SELECT USING (
  public.is_admin_user(auth.uid())
);

CREATE POLICY "Users can view own subscription" ON public.user_subscriptions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can update subscriptions" ON public.user_subscriptions
FOR UPDATE USING (
  public.is_admin_user(auth.uid())
);

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Admins can update subscriptions" ON public.user_subscriptions;

-- Create updated policies that check both admin_users AND user_roles
CREATE POLICY "Admins can view all subscriptions" ON public.user_subscriptions
FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin')
);

CREATE POLICY "Admins can update subscriptions" ON public.user_subscriptions
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin')
);

-- Also add policy for users to view their own subscription
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions
FOR SELECT USING (auth.uid() = user_id);
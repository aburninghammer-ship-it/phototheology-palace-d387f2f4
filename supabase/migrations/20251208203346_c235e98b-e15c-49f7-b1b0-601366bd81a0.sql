-- Add policy to allow authenticated users to view all profiles for community features
-- This enables leaderboards, user profiles, active users, following, and community posts

CREATE POLICY "Authenticated users can view profiles for community features"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: Sensitive data like payment info is stored in user_subscriptions table
-- which has separate, strict RLS policies (admin-only access)
-- Users access their subscription via the get_subscription_summary() function
-- Add policy for anonymous users to view basic public profile info (for online users, subscriber counts)
-- This is non-sensitive data needed for public features
CREATE POLICY "Anyone can view basic public profile info"
ON public.profiles
FOR SELECT
TO anon
USING (true);

-- Note: This allows anon to see profile rows, but RLS on other tables 
-- still protects sensitive data. The profiles table itself doesn't contain 
-- truly sensitive PII - email is in auth.users, not profiles.
-- Allow anyone to read basic profile info for active users display
CREATE POLICY "Anyone can view basic profile info"
ON public.profiles
FOR SELECT
USING (true);
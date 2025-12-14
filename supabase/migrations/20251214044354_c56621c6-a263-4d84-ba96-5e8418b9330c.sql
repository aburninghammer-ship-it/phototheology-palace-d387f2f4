-- Drop the problematic policies causing recursion
DROP POLICY IF EXISTS "Admins can manage live sessions" ON public.live_demo_sessions;
DROP POLICY IF EXISTS "Subscribers can view sessions" ON public.live_demo_sessions;

-- Create simpler policies without recursion
-- Allow authenticated users to read live/scheduled sessions
CREATE POLICY "Anyone authenticated can view live sessions"
ON public.live_demo_sessions
FOR SELECT
TO authenticated
USING (status IN ('live', 'scheduled'));

-- Allow users to insert/update/delete their own sessions (host_id matches)
CREATE POLICY "Hosts can manage their own sessions"
ON public.live_demo_sessions
FOR ALL
TO authenticated
USING (auth.uid() = host_id)
WITH CHECK (auth.uid() = host_id);
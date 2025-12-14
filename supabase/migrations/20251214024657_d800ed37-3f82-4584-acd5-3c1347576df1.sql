-- Create live demo sessions table
CREATE TABLE public.live_demo_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Live Phototheology Demo',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  viewer_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.live_demo_sessions ENABLE ROW LEVEL SECURITY;

-- Admins can manage sessions
CREATE POLICY "Admins can manage live sessions"
ON public.live_demo_sessions
FOR ALL
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Subscribers can view live/scheduled sessions
CREATE POLICY "Subscribers can view sessions"
ON public.live_demo_sessions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_subscriptions 
    WHERE user_id = auth.uid() 
    AND status IN ('active', 'trial')
  )
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND has_lifetime_access = true
  )
);

-- Create live session viewers table for presence tracking
CREATE TABLE public.live_demo_viewers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES live_demo_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  display_name TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  left_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(session_id, user_id)
);

-- Enable RLS
ALTER TABLE public.live_demo_viewers ENABLE ROW LEVEL SECURITY;

-- Users can manage their own viewer record
CREATE POLICY "Users can manage their viewer record"
ON public.live_demo_viewers
FOR ALL
USING (auth.uid() = user_id);

-- Anyone in session can see viewers
CREATE POLICY "Session participants can see viewers"
ON public.live_demo_viewers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM live_demo_sessions 
    WHERE id = session_id 
    AND status = 'live'
  )
);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_demo_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_demo_viewers;
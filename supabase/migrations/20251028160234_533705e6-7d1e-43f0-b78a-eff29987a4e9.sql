-- Create email campaigns table for tracking automated emails
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('welcome', 'engagement', 're-engagement', 'achievement', 'milestone')),
  subject TEXT NOT NULL,
  trigger_condition TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create email logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE SET NULL,
  email_address TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'bounced', 'opened')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user engagement tracking table
CREATE TABLE IF NOT EXISTS public.user_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_login_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  login_streak INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_engagement ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_campaigns (admins only)
CREATE POLICY "Admins can manage email campaigns"
  ON public.email_campaigns
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- RLS policies for email_logs (users can view their own)
CREATE POLICY "Users can view their own email logs"
  ON public.email_logs
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Service role can insert email logs"
  ON public.email_logs
  FOR INSERT
  WITH CHECK (true);

-- RLS policies for user_engagement
CREATE POLICY "Users can view their own engagement"
  ON public.user_engagement
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own engagement"
  ON public.user_engagement
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all engagement"
  ON public.user_engagement
  FOR ALL
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX idx_email_logs_campaign_id ON public.email_logs(campaign_id);
CREATE INDEX idx_email_logs_sent_at ON public.email_logs(sent_at);
CREATE INDEX idx_user_engagement_user_id ON public.user_engagement(user_id);
CREATE INDEX idx_user_engagement_last_activity ON public.user_engagement(last_activity_at);

-- Insert default email campaigns
INSERT INTO public.email_campaigns (name, type, subject, trigger_condition) VALUES
  ('Welcome Email', 'welcome', 'Welcome to Phototheology! 🎉', 'user_signup'),
  ('7-Day Engagement', 'engagement', 'Keep Your Streak Going! 🔥', '7_days_no_activity'),
  ('Achievement Unlocked', 'achievement', 'You''ve Earned a New Badge! 🏆', 'achievement_earned'),
  ('Weekly Progress', 'milestone', 'Your Week in Review 📊', 'weekly_summary');

-- Function to update engagement timestamps
CREATE OR REPLACE FUNCTION update_user_engagement()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_engagement (user_id, last_login_at, last_activity_at, total_sessions)
  VALUES (auth.uid(), NOW(), NOW(), 1)
  ON CONFLICT (user_id)
  DO UPDATE SET
    last_login_at = NOW(),
    last_activity_at = NOW(),
    total_sessions = user_engagement.total_sessions + 1,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Create table for SMS notification preferences
CREATE TABLE public.sms_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  preferred_time TIME DEFAULT '09:00:00',
  timezone TEXT DEFAULT 'America/New_York',
  last_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.sms_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only see and manage their own preferences
CREATE POLICY "Users can view their own SMS preferences"
  ON public.sms_notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SMS preferences"
  ON public.sms_notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SMS preferences"
  ON public.sms_notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SMS preferences"
  ON public.sms_notification_preferences
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_sms_notification_preferences_updated_at
  BEFORE UPDATE ON public.sms_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create table to track sent daily tips
CREATE TABLE public.daily_tip_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tip_type TEXT NOT NULL,
  tip_content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivery_status TEXT DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.daily_tip_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own tip logs
CREATE POLICY "Users can view their own tip logs"
  ON public.daily_tip_logs
  FOR SELECT
  USING (auth.uid() = user_id);
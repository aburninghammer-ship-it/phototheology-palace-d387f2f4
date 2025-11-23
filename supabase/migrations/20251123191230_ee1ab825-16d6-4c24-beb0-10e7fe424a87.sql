-- Add daily_verse notification preference
ALTER TABLE notification_preferences 
ADD COLUMN IF NOT EXISTS daily_verse boolean DEFAULT true;

COMMENT ON COLUMN notification_preferences.daily_verse IS 'Receive daily verse of the day notifications';
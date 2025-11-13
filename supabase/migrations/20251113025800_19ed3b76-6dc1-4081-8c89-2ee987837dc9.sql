-- Add renewal_reminders field to notification_preferences table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'notification_preferences' 
                 AND column_name = 'renewal_reminders') THEN
    ALTER TABLE public.notification_preferences 
    ADD COLUMN renewal_reminders BOOLEAN NOT NULL DEFAULT true;
  END IF;
END $$;
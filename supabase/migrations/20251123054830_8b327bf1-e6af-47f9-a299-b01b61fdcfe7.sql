-- Add cancellation tracking to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_cancelled_at TIMESTAMPTZ;

-- Create function to delete user data after 30 days of cancellation
CREATE OR REPLACE FUNCTION delete_cancelled_user_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find users cancelled 30+ days ago
  FOR user_record IN 
    SELECT id FROM profiles 
    WHERE subscription_cancelled_at IS NOT NULL 
    AND subscription_cancelled_at < NOW() - INTERVAL '30 days'
  LOOP
    -- Delete all user data
    DELETE FROM user_studies WHERE user_id = user_record.id;
    DELETE FROM bookmarks WHERE user_id = user_record.id;
    DELETE FROM course_progress WHERE user_id = user_record.id;
    DELETE FROM challenge_submissions WHERE user_id = user_record.id;
    DELETE FROM drill_results WHERE user_id = user_record.id;
    DELETE FROM game_scores WHERE user_id = user_record.id;
    DELETE FROM user_achievements WHERE user_id = user_record.id;
    DELETE FROM room_mastery_levels WHERE user_id = user_record.id;
    DELETE FROM mastery_streaks WHERE user_id = user_record.id;
    DELETE FROM reading_plans WHERE user_id = user_record.id;
    DELETE FROM user_reading_progress WHERE user_id = user_record.id;
    DELETE FROM christ_chapter_findings WHERE user_id = user_record.id;
    DELETE FROM bible_images WHERE user_id = user_record.id;
    DELETE FROM notifications WHERE user_id = user_record.id;
    DELETE FROM user_gems WHERE user_id = user_record.id;
    DELETE FROM study_collaborators WHERE user_id = user_record.id;
    DELETE FROM church_members WHERE user_id = user_record.id;
    DELETE FROM flashcard_sets WHERE user_id = user_record.id;
    DELETE FROM dojo_lessons WHERE user_id = user_record.id;
    DELETE FROM dojo_challenges WHERE user_id = user_record.id;
    
    -- Finally delete the profile
    DELETE FROM profiles WHERE id = user_record.id;
    
    -- Delete from auth.users
    DELETE FROM auth.users WHERE id = user_record.id;
    
    RAISE NOTICE 'Deleted data for cancelled user: %', user_record.id;
  END LOOP;
END;
$$;
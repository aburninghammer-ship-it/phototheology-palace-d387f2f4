-- Create a trigger to send notifications when users receive direct messages
CREATE OR REPLACE FUNCTION notify_message_received()
RETURNS TRIGGER AS $$
DECLARE
  sender_profile RECORD;
  recipient_id UUID;
BEGIN
  -- Get sender's profile information
  SELECT display_name INTO sender_profile
  FROM profiles
  WHERE id = NEW.sender_id;

  -- Determine the recipient (the other user in the conversation)
  SELECT 
    CASE 
      WHEN c.user1_id = NEW.sender_id THEN c.user2_id
      ELSE c.user1_id
    END INTO recipient_id
  FROM conversations c
  WHERE c.id = NEW.conversation_id;

  -- Create notification for recipient (not for sender)
  IF recipient_id IS NOT NULL AND recipient_id != NEW.sender_id THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      recipient_id,
      'message',
      'New Message',
      COALESCE(sender_profile.display_name, 'Someone') || ' sent you a message',
      '/bible'  -- Link to where messages are accessible
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on messages table
DROP TRIGGER IF EXISTS on_message_received ON messages;
CREATE TRIGGER on_message_received
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_message_received();
-- Fix notify_message_received function to use correct column names
CREATE OR REPLACE FUNCTION public.notify_message_received()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  sender_profile RECORD;
  recipient_id UUID;
BEGIN
  -- Get sender's profile information
  SELECT display_name INTO sender_profile
  FROM profiles
  WHERE id = NEW.sender_id;

  -- Determine the recipient (the other user in the conversation)
  -- Fixed: Use participant1_id and participant2_id instead of user1_id and user2_id
  SELECT 
    CASE 
      WHEN c.participant1_id = NEW.sender_id THEN c.participant2_id
      ELSE c.participant1_id
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
      '/bible'
    );
  END IF;

  RETURN NEW;
END;
$function$;
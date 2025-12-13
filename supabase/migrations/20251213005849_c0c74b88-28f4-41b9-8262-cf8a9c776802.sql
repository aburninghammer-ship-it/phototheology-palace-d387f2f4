-- Create function to notify all users of new community posts
CREATE OR REPLACE FUNCTION public.notify_all_users_on_new_post()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert notification for all users except the post author
  INSERT INTO public.notifications (user_id, type, title, message, link, metadata)
  SELECT 
    p.id,
    'community_post',
    'New Community Post',
    'A new post "' || LEFT(NEW.title, 50) || CASE WHEN LENGTH(NEW.title) > 50 THEN '...' ELSE '' END || '" was shared in ' || COALESCE(NEW.category, 'General'),
    '/community',
    jsonb_build_object(
      'post_id', NEW.id,
      'category', NEW.category,
      'author_id', NEW.user_id
    )
  FROM public.profiles p
  WHERE p.id != NEW.user_id;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for new community posts
DROP TRIGGER IF EXISTS notify_users_on_new_community_post ON public.community_posts;
CREATE TRIGGER notify_users_on_new_community_post
  AFTER INSERT ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_all_users_on_new_post();
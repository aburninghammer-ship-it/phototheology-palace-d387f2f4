-- First, let's ensure all users in community_comments have profiles
-- This prevents foreign key constraint violations
INSERT INTO public.profiles (id, username, display_name)
SELECT DISTINCT 
  cc.user_id,
  split_part(u.email, '@', 1) as username,
  split_part(u.email, '@', 1) as display_name
FROM public.community_comments cc
JOIN auth.users u ON u.id = cc.user_id
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = cc.user_id)
ON CONFLICT (id) DO NOTHING;

-- Do the same for community_posts
INSERT INTO public.profiles (id, username, display_name)
SELECT DISTINCT 
  cp.user_id,
  split_part(u.email, '@', 1) as username,
  split_part(u.email, '@', 1) as display_name
FROM public.community_posts cp
JOIN auth.users u ON u.id = cp.user_id
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = cp.user_id)
ON CONFLICT (id) DO NOTHING;

-- Now add the foreign key constraints if they don't exist
-- Drop old constraint if it exists and add new one
DO $$ 
BEGIN
  -- For community_comments
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'community_comments_user_id_fkey' 
    AND table_name = 'community_comments'
  ) THEN
    ALTER TABLE public.community_comments 
    DROP CONSTRAINT community_comments_user_id_fkey;
  END IF;
  
  ALTER TABLE public.community_comments
  ADD CONSTRAINT community_comments_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

  -- For community_posts
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'community_posts_user_id_fkey' 
    AND table_name = 'community_posts'
  ) THEN
    ALTER TABLE public.community_posts 
    DROP CONSTRAINT community_posts_user_id_fkey;
  END IF;
  
  ALTER TABLE public.community_posts
  ADD CONSTRAINT community_posts_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
END $$;
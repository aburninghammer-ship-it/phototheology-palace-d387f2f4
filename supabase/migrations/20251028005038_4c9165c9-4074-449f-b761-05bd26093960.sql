-- Add is_public column to bible_images table
ALTER TABLE public.bible_images 
ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;

-- Update RLS policy to allow viewing public images
DROP POLICY IF EXISTS "Users can view their own images" ON public.bible_images;

CREATE POLICY "Users can view their own and public images"
ON public.bible_images
FOR SELECT
USING (
  auth.uid() = user_id OR is_public = true
);

-- Add policy to allow users to see who created public images (for attribution)
-- This is already covered by the profiles table being publicly viewable

-- Create index for better performance when querying public images
CREATE INDEX IF NOT EXISTS idx_bible_images_public 
ON public.bible_images(is_public, created_at DESC) 
WHERE is_public = true;
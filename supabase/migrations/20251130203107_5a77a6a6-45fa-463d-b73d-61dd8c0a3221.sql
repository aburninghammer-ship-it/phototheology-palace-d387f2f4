-- Add updated_at column to community_comments table
ALTER TABLE public.community_comments 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing records to have updated_at match created_at
UPDATE public.community_comments 
SET updated_at = created_at 
WHERE updated_at IS NULL;
-- Add parent_comment_id to community_comments for nested replies
ALTER TABLE community_comments 
ADD COLUMN IF NOT EXISTS parent_comment_id uuid REFERENCES community_comments(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_comments_parent ON community_comments(parent_comment_id);

-- Update RLS policies to handle nested comments
DROP POLICY IF EXISTS "Users can create comments" ON community_comments;

CREATE POLICY "Users can create comments and replies" 
ON community_comments
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
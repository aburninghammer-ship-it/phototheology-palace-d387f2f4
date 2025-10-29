-- Add community challenge responses table for grading
CREATE TABLE IF NOT EXISTS community_challenge_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  jeeves_grade JSONB,
  highlighted_parts TEXT[],
  grade_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  graded_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE community_challenge_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view challenge responses"
  ON community_challenge_responses
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own responses"
  ON community_challenge_responses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses"
  ON community_challenge_responses
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX idx_challenge_responses_post ON community_challenge_responses(post_id);
CREATE INDEX idx_challenge_responses_user ON community_challenge_responses(user_id);
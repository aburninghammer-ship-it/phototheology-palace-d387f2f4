-- Add followup_conversation column to thought_analyses for AnalyzeThoughts Jeeves conversations
ALTER TABLE public.thought_analyses
ADD COLUMN IF NOT EXISTS followup_conversation jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.thought_analyses.followup_conversation IS 'Stores the follow-up Jeeves conversation as an array of messages';
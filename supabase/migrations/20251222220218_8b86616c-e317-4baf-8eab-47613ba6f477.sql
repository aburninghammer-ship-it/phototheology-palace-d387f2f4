-- Add jeeves_conversation column to user_studies table
ALTER TABLE public.user_studies 
ADD COLUMN IF NOT EXISTS jeeves_conversation JSONB DEFAULT '[]'::jsonb;
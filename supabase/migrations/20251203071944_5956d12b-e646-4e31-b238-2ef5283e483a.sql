-- Add score and feedback columns to user_drill_completions
ALTER TABLE public.user_drill_completions 
ADD COLUMN IF NOT EXISTS score integer,
ADD COLUMN IF NOT EXISTS feedback text,
ADD COLUMN IF NOT EXISTS time_seconds integer;

-- Add unique constraint on user_id and drill_id for upsert support
ALTER TABLE public.user_drill_completions 
DROP CONSTRAINT IF EXISTS user_drill_completions_user_drill_unique;

ALTER TABLE public.user_drill_completions 
ADD CONSTRAINT user_drill_completions_user_drill_unique UNIQUE (user_id, drill_id);
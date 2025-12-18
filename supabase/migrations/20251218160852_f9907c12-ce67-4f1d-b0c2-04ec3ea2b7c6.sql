-- Add columns for daily progress tracking to leader_onboarding_progress
ALTER TABLE public.leader_onboarding_progress 
ADD COLUMN IF NOT EXISTS completed_days integer[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS started_at timestamp with time zone DEFAULT now();

-- Update existing rows to have empty completed_days array
UPDATE public.leader_onboarding_progress 
SET completed_days = '{}' 
WHERE completed_days IS NULL;

-- Set started_at for existing rows
UPDATE public.leader_onboarding_progress 
SET started_at = created_at 
WHERE started_at IS NULL;
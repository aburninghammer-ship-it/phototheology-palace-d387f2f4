-- Drop existing check constraint and add one that includes all statuses
ALTER TABLE public.devotional_plans DROP CONSTRAINT IF EXISTS devotional_plans_status_check;
ALTER TABLE public.devotional_plans ADD CONSTRAINT devotional_plans_status_check CHECK (status IN ('pending', 'draft', 'generating', 'active', 'completed', 'paused', 'failed'));
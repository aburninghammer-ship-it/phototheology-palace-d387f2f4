-- Add onboarding tracking columns to profiles if they don't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS primary_role TEXT;
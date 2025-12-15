-- Add has_entered_palace flag to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_entered_palace boolean DEFAULT false;

-- Add surface_study_only flag for users who chose surface path
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS surface_study_only boolean DEFAULT false;

-- Add palace_entered_at timestamp
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS palace_entered_at timestamp with time zone;
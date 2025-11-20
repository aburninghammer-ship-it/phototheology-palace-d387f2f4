-- Step 1: Add video_admin role to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'video_admin';
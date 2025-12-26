-- Fix 1: Add RLS policies to profiles table to restrict public access
-- Drop any overly permissive SELECT policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create restrictive policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can view basic public info of others"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Fix 2: Add RLS policies to baptism_candidates table
ALTER TABLE public.baptism_candidates ENABLE ROW LEVEL SECURITY;

-- Only church admins and assigned workers can view baptism candidates
CREATE POLICY "Church admins can view baptism candidates"
ON public.baptism_candidates
FOR SELECT
TO authenticated
USING (
  public.is_church_admin(auth.uid(), church_id)
  OR bible_worker_id = auth.uid()
  OR pastor_id = auth.uid()
  OR follow_up_assigned_to = auth.uid()
);

CREATE POLICY "Church admins can insert baptism candidates"
ON public.baptism_candidates
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_church_admin(auth.uid(), church_id)
  OR public.is_ministry_leader(auth.uid(), church_id)
);

CREATE POLICY "Church admins can update baptism candidates"
ON public.baptism_candidates
FOR UPDATE
TO authenticated
USING (
  public.is_church_admin(auth.uid(), church_id)
  OR bible_worker_id = auth.uid()
  OR pastor_id = auth.uid()
);

CREATE POLICY "Church admins can delete baptism candidates"
ON public.baptism_candidates
FOR DELETE
TO authenticated
USING (public.is_church_admin(auth.uid(), church_id));
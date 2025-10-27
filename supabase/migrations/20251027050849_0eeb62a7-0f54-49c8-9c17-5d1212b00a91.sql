-- Delete all existing study rooms
DELETE FROM public.study_rooms;

-- Ensure RLS is enabled on study_rooms
ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view all study rooms" ON public.study_rooms;
DROP POLICY IF EXISTS "Study rooms viewable by all" ON public.study_rooms;

-- Add proper RLS policies
-- Only authenticated users can view study rooms
CREATE POLICY "Authenticated users can view study rooms"
ON public.study_rooms
FOR SELECT
TO authenticated
USING (true);

-- Users can only delete their own rooms
CREATE POLICY "Users can delete own rooms"
ON public.study_rooms
FOR DELETE
TO authenticated
USING (auth.uid() = host_id);

-- Users can only update their own rooms
CREATE POLICY "Users can update own rooms"
ON public.study_rooms
FOR UPDATE
TO authenticated
USING (auth.uid() = host_id);

-- Users can create their own rooms
CREATE POLICY "Users can create rooms"
ON public.study_rooms
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = host_id);
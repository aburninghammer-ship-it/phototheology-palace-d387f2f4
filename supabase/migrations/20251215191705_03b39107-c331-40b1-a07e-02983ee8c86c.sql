-- Drop restrictive SELECT policies
DROP POLICY IF EXISTS "Users can view their own streaks" ON public.mastery_streaks;
DROP POLICY IF EXISTS "Users can view their own streaks" ON public.reading_streaks;

-- Create policies allowing all authenticated users to view streaks (for leaderboard)
CREATE POLICY "Authenticated users can view all streaks" 
ON public.mastery_streaks 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view all streaks" 
ON public.reading_streaks 
FOR SELECT 
TO authenticated
USING (true);
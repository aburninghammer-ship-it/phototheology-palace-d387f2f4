-- Drop the problematic policy that's causing the issue
DROP POLICY IF EXISTS "Users can view their own growth journal" ON public.challenge_submissions;

-- Recreate it properly for authenticated users only
CREATE POLICY "Users can view their own growth journal" 
  ON public.challenge_submissions 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);
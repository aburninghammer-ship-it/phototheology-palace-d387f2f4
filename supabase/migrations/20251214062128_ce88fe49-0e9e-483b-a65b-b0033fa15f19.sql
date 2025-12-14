-- Allow authenticated users to update their own challenge submissions
CREATE POLICY "Users can update own submissions"
  ON public.challenge_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
-- Fix the conversations INSERT policy to allow creating conversations with other users
-- The current policy requires auth.uid() to be BOTH participants, which is impossible
-- We only need to verify that auth.uid() is one of the participants (participant1_id)

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;

CREATE POLICY "Users can create conversations"
ON public.conversations
FOR INSERT
WITH CHECK (auth.uid() = participant1_id);
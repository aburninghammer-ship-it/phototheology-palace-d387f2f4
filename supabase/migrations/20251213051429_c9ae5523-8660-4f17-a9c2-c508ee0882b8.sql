-- Add INSERT policy for notifications table to allow users to send notifications to partners
-- This is needed for partner nudges and similar features

CREATE POLICY "Users can create notifications for others"
ON public.notifications
FOR INSERT
WITH CHECK (
  -- Allow inserting notifications for partnership nudges and similar features
  -- The sender must be authenticated
  auth.uid() IS NOT NULL
);
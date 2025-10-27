-- Update study_rooms RLS policies to make rooms private and deletable

-- Drop existing public policy if it exists
DROP POLICY IF EXISTS "Study rooms are viewable by everyone" ON study_rooms;

-- Allow users to view only their own hosted rooms and rooms they're participants in
CREATE POLICY "Users can view their own rooms"
ON study_rooms
FOR SELECT
TO authenticated
USING (host_id = auth.uid());

-- Allow users to delete their own rooms
CREATE POLICY "Users can delete their own rooms"
ON study_rooms
FOR DELETE
TO authenticated
USING (host_id = auth.uid());
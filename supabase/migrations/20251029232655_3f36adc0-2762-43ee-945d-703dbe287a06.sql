-- Enable RLS on strongs_dictionary
ALTER TABLE strongs_dictionary ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view Strong's dictionary (public reference data)
CREATE POLICY "Strong's dictionary viewable by everyone"
ON strongs_dictionary
FOR SELECT
TO authenticated, anon
USING (true);
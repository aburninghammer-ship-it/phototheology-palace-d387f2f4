-- Create storage bucket for bible images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('bible-images', 'bible-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Public read access for bible-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload to bible-images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own uploads in bible-images" ON storage.objects;

-- Allow public read access to bible-images bucket
CREATE POLICY "Public read access for bible-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'bible-images');

-- Allow authenticated users to upload to bible-images bucket
CREATE POLICY "Authenticated upload to bible-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bible-images');

-- Allow users to update their own uploads
CREATE POLICY "Users can update own uploads in bible-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'bible-images');
-- Fix 1: Make user-music bucket private
UPDATE storage.buckets SET public = false WHERE id = 'user-music';

-- Create RLS policies for user-music bucket to allow only owners to access their files
CREATE POLICY "Users can view their own music files"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-music' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own music files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-music' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own music files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'user-music' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own music files"
ON storage.objects FOR DELETE
USING (bucket_id = 'user-music' AND auth.uid()::text = (storage.foldername(name))[1]);
-- Create bible_audio_cache table to track cached audio files
CREATE TABLE public.bible_audio_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book text NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  voice_id text NOT NULL DEFAULT 'daniel',
  storage_path text NOT NULL,
  duration_ms integer,
  file_size_bytes integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(book, chapter, verse, voice_id)
);

-- Enable RLS
ALTER TABLE public.bible_audio_cache ENABLE ROW LEVEL SECURITY;

-- Anyone can read cached audio (public content)
CREATE POLICY "Anyone can read cached audio"
ON public.bible_audio_cache
FOR SELECT
USING (true);

-- Only service role can insert/update (edge functions)
CREATE POLICY "Service role can manage cache"
ON public.bible_audio_cache
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for fast lookups
CREATE INDEX idx_bible_audio_cache_lookup 
ON public.bible_audio_cache(book, chapter, verse, voice_id);

-- Create storage bucket for bible audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('bible-audio', 'bible-audio', true);

-- Allow public read access to audio files
CREATE POLICY "Public read access for bible audio"
ON storage.objects
FOR SELECT
USING (bucket_id = 'bible-audio');

-- Allow service role to upload audio files
CREATE POLICY "Service role can upload bible audio"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'bible-audio');

CREATE POLICY "Service role can update bible audio"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'bible-audio');

CREATE POLICY "Service role can delete bible audio"
ON storage.objects
FOR DELETE
USING (bucket_id = 'bible-audio');
-- Add book and chapter columns to bible_images for folder organization
ALTER TABLE public.bible_images 
ADD COLUMN IF NOT EXISTS book TEXT,
ADD COLUMN IF NOT EXISTS chapter INTEGER;

-- Create index for faster folder filtering
CREATE INDEX IF NOT EXISTS idx_bible_images_book_chapter ON public.bible_images(book, chapter);

-- Backfill existing data by parsing verse_reference
-- Extract book name (everything before the first digit)
-- Extract chapter (first number after book name, before colon or end)
UPDATE public.bible_images
SET 
  book = TRIM(regexp_replace(verse_reference, '\s*\d+.*$', '')),
  chapter = CAST(
    NULLIF(
      (regexp_match(verse_reference, '(\d+)'))[1], 
      ''
    ) AS INTEGER
  )
WHERE verse_reference IS NOT NULL 
  AND book IS NULL;
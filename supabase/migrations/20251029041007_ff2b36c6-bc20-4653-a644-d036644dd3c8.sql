-- Add word column to verses_strongs table to store the actual Greek/Hebrew word
ALTER TABLE public.verses_strongs 
ADD COLUMN IF NOT EXISTS word TEXT NOT NULL DEFAULT '';

-- Add index for word searches
CREATE INDEX IF NOT EXISTS idx_verses_strongs_word 
ON public.verses_strongs(word);
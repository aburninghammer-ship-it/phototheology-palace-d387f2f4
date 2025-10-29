-- Add testament column to verses_strongs table
ALTER TABLE public.verses_strongs 
ADD COLUMN IF NOT EXISTS testament TEXT NOT NULL DEFAULT 'NT' CHECK (testament IN ('OT', 'NT'));

-- Add index for testament-based queries
CREATE INDEX IF NOT EXISTS idx_verses_strongs_testament 
ON public.verses_strongs(testament, book);
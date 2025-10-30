-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can insert bible verses" ON public.bible_verses_tokenized;
DROP POLICY IF EXISTS "Authenticated users can update bible verses" ON public.bible_verses_tokenized;

-- Create policy to allow authenticated users to insert/update
CREATE POLICY "Authenticated users can insert bible verses"
  ON public.bible_verses_tokenized
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update bible verses"
  ON public.bible_verses_tokenized
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
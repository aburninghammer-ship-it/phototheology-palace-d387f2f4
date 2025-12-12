-- Add access code columns to guesthouse_events
ALTER TABLE public.guesthouse_events
ADD COLUMN IF NOT EXISTS access_code TEXT,
ADD COLUMN IF NOT EXISTS requires_access_code BOOLEAN NOT NULL DEFAULT false;

-- Create function to generate unique event access codes
CREATE OR REPLACE FUNCTION public.generate_guesthouse_access_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  code TEXT;
  attempts INT := 0;
BEGIN
  LOOP
    code := 'GH' || UPPER(SUBSTRING(MD5(random()::TEXT || NOW()::TEXT) FROM 1 FOR 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.guesthouse_events WHERE access_code = code);
    attempts := attempts + 1;
    IF attempts > 100 THEN
      RAISE EXCEPTION 'Failed to generate unique access code';
    END IF;
  END LOOP;
  RETURN code;
END;
$$;

-- Create index for faster access code lookups
CREATE INDEX IF NOT EXISTS idx_guesthouse_events_access_code ON public.guesthouse_events(access_code) WHERE access_code IS NOT NULL;
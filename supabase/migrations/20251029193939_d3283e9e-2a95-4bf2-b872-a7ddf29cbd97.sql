-- Fix search_path for generate_challenge_share_code function
DROP FUNCTION IF EXISTS generate_challenge_share_code();

CREATE OR REPLACE FUNCTION generate_challenge_share_code()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code TEXT;
  attempts INT := 0;
BEGIN
  LOOP
    code := 'EQ' || UPPER(SUBSTRING(MD5(random()::TEXT || NOW()::TEXT) FROM 1 FOR 8));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.equation_challenges WHERE share_code = code);
    attempts := attempts + 1;
    IF attempts > 100 THEN
      RAISE EXCEPTION 'Failed to generate unique share code';
    END IF;
  END LOOP;
  RETURN code;
END;
$$;
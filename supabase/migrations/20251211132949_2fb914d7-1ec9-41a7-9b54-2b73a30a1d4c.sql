-- 1. Create trigger to auto-encrypt Patreon tokens on insert/update
CREATE OR REPLACE FUNCTION public.encrypt_patreon_tokens()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Encrypt access_token if it's being set and doesn't look already encrypted
  IF NEW.access_token IS NOT NULL AND NEW.access_token != '' 
     AND NEW.access_token NOT LIKE 'c2%' THEN -- base64 encrypted tokens start with specific patterns
    NEW.access_token := public.encrypt_token(NEW.access_token);
  END IF;
  
  -- Encrypt refresh_token if it's being set and doesn't look already encrypted
  IF NEW.refresh_token IS NOT NULL AND NEW.refresh_token != ''
     AND NEW.refresh_token NOT LIKE 'c2%' THEN
    NEW.refresh_token := public.encrypt_token(NEW.refresh_token);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for patreon_connections
DROP TRIGGER IF EXISTS encrypt_patreon_tokens_trigger ON public.patreon_connections;
CREATE TRIGGER encrypt_patreon_tokens_trigger
  BEFORE INSERT OR UPDATE ON public.patreon_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.encrypt_patreon_tokens();

-- 2. Create a secure function to get decrypted tokens (only for the owner)
CREATE OR REPLACE FUNCTION public.get_decrypted_patreon_tokens(_user_id uuid)
RETURNS TABLE(access_token text, refresh_token text, token_expires_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow users to get their own tokens
  IF _user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  RETURN QUERY
  SELECT 
    public.decrypt_token(pc.access_token),
    public.decrypt_token(pc.refresh_token),
    pc.token_expires_at
  FROM public.patreon_connections pc
  WHERE pc.user_id = _user_id;
END;
$$;

-- 3. Add rate limiting for profile queries (create rate_limits table policy if not exists)
-- Add index for faster rate limit lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint ON public.rate_limits(user_id, endpoint);

-- 4. Encrypt sensitive devotional profile fields - create encrypted columns
ALTER TABLE public.devotional_profiles 
  ADD COLUMN IF NOT EXISTS issue_description_encrypted text,
  ADD COLUMN IF NOT EXISTS pastoral_notes_encrypted text;

-- Create function to encrypt/decrypt devotional sensitive data
CREATE OR REPLACE FUNCTION public.encrypt_devotional_sensitive_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Encrypt issue_description
  IF NEW.issue_description IS NOT NULL AND NEW.issue_description != '' THEN
    NEW.issue_description_encrypted := public.encrypt_token(NEW.issue_description);
    NEW.issue_description := '[ENCRYPTED]'; -- Clear plaintext
  END IF;
  
  -- Encrypt pastoral_notes
  IF NEW.pastoral_notes IS NOT NULL THEN
    NEW.pastoral_notes_encrypted := public.encrypt_token(NEW.pastoral_notes::text);
    NEW.pastoral_notes := '{"encrypted": true}'::jsonb; -- Clear plaintext
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for devotional_profiles
DROP TRIGGER IF EXISTS encrypt_devotional_sensitive_trigger ON public.devotional_profiles;
CREATE TRIGGER encrypt_devotional_sensitive_trigger
  BEFORE INSERT OR UPDATE ON public.devotional_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.encrypt_devotional_sensitive_data();

-- 5. Create secure function to get decrypted devotional data
CREATE OR REPLACE FUNCTION public.get_decrypted_devotional_profile(_profile_id uuid)
RETURNS TABLE(
  issue_description text,
  pastoral_notes jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  profile_owner uuid;
BEGIN
  -- Get the owner of this devotional profile
  SELECT user_id INTO profile_owner FROM public.devotional_profiles WHERE id = _profile_id;
  
  -- Only allow the owner to decrypt
  IF profile_owner != auth.uid() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  RETURN QUERY
  SELECT 
    CASE 
      WHEN dp.issue_description_encrypted IS NOT NULL 
      THEN public.decrypt_token(dp.issue_description_encrypted)
      ELSE dp.issue_description
    END,
    CASE 
      WHEN dp.pastoral_notes_encrypted IS NOT NULL 
      THEN (public.decrypt_token(dp.pastoral_notes_encrypted))::jsonb
      ELSE dp.pastoral_notes
    END
  FROM public.devotional_profiles dp
  WHERE dp.id = _profile_id;
END;
$$;
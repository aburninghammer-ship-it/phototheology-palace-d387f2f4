-- Create table for storing Patreon connections
CREATE TABLE public.patreon_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  patreon_user_id TEXT NOT NULL,
  patreon_email TEXT,
  patreon_name TEXT,
  is_active_patron BOOLEAN DEFAULT FALSE,
  entitled_cents INTEGER DEFAULT 0,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.patreon_connections ENABLE ROW LEVEL SECURITY;

-- Users can view their own connection
CREATE POLICY "Users can view their own Patreon connection"
ON public.patreon_connections
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can manage all (for edge functions)
CREATE POLICY "Service role can manage Patreon connections"
ON public.patreon_connections
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for lookups
CREATE INDEX idx_patreon_connections_user_id ON public.patreon_connections(user_id);
CREATE INDEX idx_patreon_connections_patreon_user_id ON public.patreon_connections(patreon_user_id);
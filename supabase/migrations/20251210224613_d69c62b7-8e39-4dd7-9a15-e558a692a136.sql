-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role can manage Patreon connections" ON public.patreon_connections;

-- Create proper user-scoped policies for INSERT, UPDATE, DELETE
CREATE POLICY "Users can insert their own Patreon connection"
ON public.patreon_connections
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Patreon connection"
ON public.patreon_connections
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Patreon connection"
ON public.patreon_connections
FOR DELETE
USING (auth.uid() = user_id);
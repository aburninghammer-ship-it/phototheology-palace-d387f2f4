-- Enable RLS on daily_verses if not already enabled
ALTER TABLE public.daily_verses ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view daily verses" ON public.daily_verses;

-- Create policy to allow public read access to daily_verses
CREATE POLICY "Anyone can view daily verses"
ON public.daily_verses
FOR SELECT
TO public
USING (true);

-- Ensure authenticated users can still do everything if needed
DROP POLICY IF EXISTS "Authenticated users can manage daily verses" ON public.daily_verses;

CREATE POLICY "Authenticated users can manage daily verses"
ON public.daily_verses
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
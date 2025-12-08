-- Fix Critical RLS Policy: daily_verses table
-- Drop the overly permissive policy that allows any authenticated user to manage daily verses
DROP POLICY IF EXISTS "Authenticated users can manage daily verses" ON public.daily_verses;

-- Create admin-only policy for managing daily verses
CREATE POLICY "Only admins can manage daily verses" 
ON public.daily_verses 
FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role)) 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix Critical RLS Policy: bible_verses_tokenized table
-- Drop the overly permissive update policy
DROP POLICY IF EXISTS "Authenticated users can update bible verses" ON public.bible_verses_tokenized;

-- Drop the overly permissive insert policy as well
DROP POLICY IF EXISTS "Authenticated users can insert bible verses" ON public.bible_verses_tokenized;

-- Create admin-only policy for updating bible verses
CREATE POLICY "Only admins can update bible verses" 
ON public.bible_verses_tokenized 
FOR UPDATE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role)) 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create admin-only policy for inserting bible verses
CREATE POLICY "Only admins can insert bible verses" 
ON public.bible_verses_tokenized 
FOR INSERT 
TO authenticated 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
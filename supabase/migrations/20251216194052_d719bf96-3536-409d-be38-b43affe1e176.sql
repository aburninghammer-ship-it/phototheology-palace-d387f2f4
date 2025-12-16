-- Create a SECURITY DEFINER function to get user's church IDs without triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_church_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT church_id FROM public.church_members WHERE user_id = _user_id;
$$;

-- Create a function to check if user is admin of a church
CREATE OR REPLACE FUNCTION public.is_church_admin_direct(_user_id uuid, _church_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.church_members
    WHERE church_id = _church_id
      AND user_id = _user_id
      AND role = 'admin'
  );
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Members can view their church members" ON public.church_members;
DROP POLICY IF EXISTS "Admins can insert church members" ON public.church_members;
DROP POLICY IF EXISTS "Admins can update church members" ON public.church_members;
DROP POLICY IF EXISTS "Admins can delete church members" ON public.church_members;

-- Recreate policies using the SECURITY DEFINER functions to avoid recursion
CREATE POLICY "Members can view their church members" 
ON public.church_members 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  church_id IN (SELECT public.get_user_church_ids(auth.uid()))
);

CREATE POLICY "Admins can insert church members" 
ON public.church_members 
FOR INSERT 
WITH CHECK (
  public.is_church_admin_direct(auth.uid(), church_id)
);

CREATE POLICY "Admins can update church members" 
ON public.church_members 
FOR UPDATE 
USING (
  public.is_church_admin_direct(auth.uid(), church_id)
);

CREATE POLICY "Admins can delete church members" 
ON public.church_members 
FOR DELETE 
USING (
  public.is_church_admin_direct(auth.uid(), church_id)
);
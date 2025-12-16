-- Create helper function to get church_id from youth_member's group
CREATE OR REPLACE FUNCTION public.get_youth_member_church_id(_group_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT church_id FROM public.youth_groups WHERE id = _group_id
$$;

-- Create helper function to check if user can access youth member
CREATE OR REPLACE FUNCTION public.can_access_youth_member(_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.youth_groups yg
    WHERE yg.id = _group_id
    AND (
      public.is_youth_leader(auth.uid(), yg.church_id) OR 
      public.is_church_admin_direct(auth.uid(), yg.church_id)
    )
  )
$$;

-- Fix security issue #1: youth_members table
ALTER TABLE public.youth_members ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view youth members" ON public.youth_members;
DROP POLICY IF EXISTS "Public can view youth members" ON public.youth_members;
DROP POLICY IF EXISTS "Youth members are viewable by everyone" ON public.youth_members;

-- Create secure policies for youth_members using group_id
CREATE POLICY "Youth leaders and church admins can view youth members"
ON public.youth_members FOR SELECT
USING (public.can_access_youth_member(group_id));

CREATE POLICY "Youth leaders and church admins can insert youth members"
ON public.youth_members FOR INSERT
WITH CHECK (public.can_access_youth_member(group_id));

CREATE POLICY "Youth leaders and church admins can update youth members"
ON public.youth_members FOR UPDATE
USING (public.can_access_youth_member(group_id));

CREATE POLICY "Youth leaders and church admins can delete youth members"
ON public.youth_members FOR DELETE
USING (public.can_access_youth_member(group_id));

-- Fix security issue #2: devotional_profiles table
ALTER TABLE public.devotional_profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Anyone can view devotional profiles" ON public.devotional_profiles;
DROP POLICY IF EXISTS "Public can view devotional profiles" ON public.devotional_profiles;
DROP POLICY IF EXISTS "Devotional profiles are viewable by everyone" ON public.devotional_profiles;
DROP POLICY IF EXISTS "Users can view their own devotional profiles" ON public.devotional_profiles;
DROP POLICY IF EXISTS "Users can view own devotional profiles" ON public.devotional_profiles;
DROP POLICY IF EXISTS "Users can create their own devotional profiles" ON public.devotional_profiles;
DROP POLICY IF EXISTS "Users can update their own devotional profiles" ON public.devotional_profiles;
DROP POLICY IF EXISTS "Users can delete their own devotional profiles" ON public.devotional_profiles;
DROP POLICY IF EXISTS "Users can insert their own devotional profiles" ON public.devotional_profiles;

-- Create secure policies for devotional_profiles
CREATE POLICY "Users can view their own devotional profiles"
ON public.devotional_profiles FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = linked_user_id);

CREATE POLICY "Users can insert their own devotional profiles"
ON public.devotional_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devotional profiles"
ON public.devotional_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devotional profiles"
ON public.devotional_profiles FOR DELETE
USING (auth.uid() = user_id);
-- 1. Fix profiles: ensure users can ONLY view their own profile, admins can view all
-- Drop any existing permissive policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own full profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recreate strict policies
CREATE POLICY "Users can view own profile only" ON public.profiles
FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.is_admin_user(auth.uid()));

-- 2. Fix churches: restrict billing data access to admins only
-- First, drop existing SELECT policies that may be too permissive
DROP POLICY IF EXISTS "Church members can view their church" ON public.churches;
DROP POLICY IF EXISTS "Members can view church info" ON public.churches;

-- Create policy: only church admins can view their church data (including billing)
CREATE POLICY "Church admins can view their church" ON public.churches
FOR SELECT USING (
  public.is_church_admin(auth.uid(), id)
);

-- Platform admins can also view all churches
CREATE POLICY "Platform admins can view all churches" ON public.churches
FOR SELECT USING (
  public.is_admin_user(auth.uid())
);

-- 3. Fix pending_student_verifications: users can only see their own verification attempts
DROP POLICY IF EXISTS "Users can view their own verification attempts" ON public.pending_student_verifications;
DROP POLICY IF EXISTS "Users can view own pending verifications" ON public.pending_student_verifications;

CREATE POLICY "Users can only view own verifications" ON public.pending_student_verifications
FOR SELECT USING (user_id = auth.uid());

-- Admins can view all for support purposes
CREATE POLICY "Admins can view all verifications" ON public.pending_student_verifications
FOR SELECT USING (public.is_admin_user(auth.uid()));
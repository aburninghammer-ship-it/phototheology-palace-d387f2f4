-- Create enum for ministry roles
CREATE TYPE public.ministry_role AS ENUM (
  'site_admin',
  'small_group_leader',
  'evangelism_lead',
  'prayer_lead',
  'sabbath_school_lead',
  'youth_lead'
);

-- Create ministry_leaders table
CREATE TABLE public.ministry_leaders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role ministry_role NOT NULL,
  assigned_group_id UUID REFERENCES public.small_groups(id) ON DELETE SET NULL,
  assigned_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(church_id, user_id, role)
);

-- Enable RLS
ALTER TABLE public.ministry_leaders ENABLE ROW LEVEL SECURITY;

-- Security definer function to check ministry role
CREATE OR REPLACE FUNCTION public.has_ministry_role(_user_id UUID, _church_id UUID, _role ministry_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.ministry_leaders
    WHERE user_id = _user_id
      AND church_id = _church_id
      AND role = _role
      AND is_active = true
  )
$$;

-- Function to check if user is any ministry leader
CREATE OR REPLACE FUNCTION public.is_ministry_leader(_user_id UUID, _church_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.ministry_leaders
    WHERE user_id = _user_id
      AND church_id = _church_id
      AND is_active = true
  )
$$;

-- Function to check if user is site admin
CREATE OR REPLACE FUNCTION public.is_site_admin(_user_id UUID, _church_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.ministry_leaders
    WHERE user_id = _user_id
      AND church_id = _church_id
      AND role = 'site_admin'
      AND is_active = true
  ) OR EXISTS (
    SELECT 1 FROM public.church_members
    WHERE user_id = _user_id
      AND church_id = _church_id
      AND role = 'admin'
  )
$$;

-- RLS Policies
CREATE POLICY "Church admins can manage ministry leaders"
ON public.ministry_leaders
FOR ALL
TO authenticated
USING (public.is_church_admin(auth.uid(), church_id))
WITH CHECK (public.is_church_admin(auth.uid(), church_id));

CREATE POLICY "Site admins can manage ministry leaders"
ON public.ministry_leaders
FOR ALL
TO authenticated
USING (public.is_site_admin(auth.uid(), church_id))
WITH CHECK (public.is_site_admin(auth.uid(), church_id));

CREATE POLICY "Ministry leaders can view their own role"
ON public.ministry_leaders
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create small_group_studies table for leader-generated studies
CREATE TABLE public.small_group_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.small_groups(id) ON DELETE CASCADE,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  week_number INTEGER,
  study_content JSONB DEFAULT '{}',
  key_passages TEXT[],
  discussion_questions TEXT[],
  christ_synthesis TEXT,
  action_challenge TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  scheduled_for DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.small_group_studies ENABLE ROW LEVEL SECURITY;

-- Small group leaders can manage studies for their groups
CREATE POLICY "Group leaders can manage their group studies"
ON public.small_group_studies
FOR ALL
TO authenticated
USING (
  created_by = auth.uid() OR
  public.is_site_admin(auth.uid(), church_id) OR
  EXISTS (
    SELECT 1 FROM public.ministry_leaders ml
    WHERE ml.user_id = auth.uid()
      AND ml.church_id = small_group_studies.church_id
      AND ml.role = 'small_group_leader'
      AND ml.assigned_group_id = small_group_studies.group_id
      AND ml.is_active = true
  )
)
WITH CHECK (
  created_by = auth.uid() OR
  public.is_site_admin(auth.uid(), church_id) OR
  EXISTS (
    SELECT 1 FROM public.ministry_leaders ml
    WHERE ml.user_id = auth.uid()
      AND ml.church_id = small_group_studies.church_id
      AND ml.role = 'small_group_leader'
      AND ml.assigned_group_id = small_group_studies.group_id
      AND ml.is_active = true
  )
);

-- Members can view published studies for their groups
CREATE POLICY "Members can view published group studies"
ON public.small_group_studies
FOR SELECT
TO authenticated
USING (
  status = 'published' AND
  EXISTS (
    SELECT 1 FROM public.small_group_members sgm
    WHERE sgm.group_id = small_group_studies.group_id
      AND sgm.user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_ministry_leaders_updated_at
  BEFORE UPDATE ON public.ministry_leaders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_living_manna_updated_at();

CREATE TRIGGER update_small_group_studies_updated_at
  BEFORE UPDATE ON public.small_group_studies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_living_manna_updated_at();
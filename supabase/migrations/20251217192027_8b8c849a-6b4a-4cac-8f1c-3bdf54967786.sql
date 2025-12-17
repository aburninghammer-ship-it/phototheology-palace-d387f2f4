-- 12-Week Discipleship Packages (if not exists)
CREATE TABLE IF NOT EXISTS public.discipleship_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  package_type TEXT NOT NULL DEFAULT 'seeker_to_disciple',
  week_content JSONB NOT NULL DEFAULT '[]',
  completion_benefits TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Leader Onboarding Track (4-week)
CREATE TABLE IF NOT EXISTS public.leader_onboarding_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Leader Onboarding',
  week_content JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User progress for discipleship packages
CREATE TABLE IF NOT EXISTS public.package_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  package_id UUID REFERENCES public.discipleship_packages(id) ON DELETE CASCADE,
  current_week INTEGER DEFAULT 1,
  completed_weeks INTEGER[] DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  unlocked_benefits TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Leader onboarding progress
CREATE TABLE IF NOT EXISTS public.leader_onboarding_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  track_id UUID REFERENCES public.leader_onboarding_tracks(id) ON DELETE CASCADE,
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  current_week INTEGER DEFAULT 1,
  completed_weeks INTEGER[] DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  is_certified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.discipleship_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leader_onboarding_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leader_onboarding_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discipleship_packages
DROP POLICY IF EXISTS "Church members can view packages" ON public.discipleship_packages;
CREATE POLICY "Church members can view packages" ON public.discipleship_packages
  FOR SELECT USING (
    church_id IN (SELECT church_id FROM public.church_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Church admins can manage packages" ON public.discipleship_packages;
CREATE POLICY "Church admins can manage packages" ON public.discipleship_packages
  FOR ALL USING (
    public.is_church_admin(auth.uid(), church_id)
  );

-- RLS Policies for leader_onboarding_tracks
DROP POLICY IF EXISTS "Church members can view onboarding" ON public.leader_onboarding_tracks;
CREATE POLICY "Church members can view onboarding" ON public.leader_onboarding_tracks
  FOR SELECT USING (
    church_id IN (SELECT church_id FROM public.church_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Church admins can manage onboarding" ON public.leader_onboarding_tracks;
CREATE POLICY "Church admins can manage onboarding" ON public.leader_onboarding_tracks
  FOR ALL USING (
    public.is_church_admin(auth.uid(), church_id)
  );

-- RLS Policies for package_progress
DROP POLICY IF EXISTS "Users can manage own package progress" ON public.package_progress;
CREATE POLICY "Users can manage own package progress" ON public.package_progress
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for leader_onboarding_progress
DROP POLICY IF EXISTS "Users can manage own onboarding progress" ON public.leader_onboarding_progress;
CREATE POLICY "Users can manage own onboarding progress" ON public.leader_onboarding_progress
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Church admins can view all onboarding progress" ON public.leader_onboarding_progress;
CREATE POLICY "Church admins can view all onboarding progress" ON public.leader_onboarding_progress
  FOR SELECT USING (
    public.is_church_admin(auth.uid(), church_id)
  );
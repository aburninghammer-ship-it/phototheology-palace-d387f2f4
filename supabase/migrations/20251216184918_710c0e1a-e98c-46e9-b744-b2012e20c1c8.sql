-- ============================================
-- LIVING MANNA DISCIPLESHIP SYSTEM SCHEMA
-- ============================================

-- Helper function: Check if user is a certified leader in a church
CREATE OR REPLACE FUNCTION public.is_certified_leader(_user_id uuid, _church_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.leader_certifications
    WHERE user_id = _user_id
      AND church_id = _church_id
      AND is_certified = true
  )
$$;

-- Helper function: Check if user is a bible worker (certified leader)
CREATE OR REPLACE FUNCTION public.is_bible_worker(_user_id uuid, _church_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.leader_certifications
    WHERE user_id = _user_id
      AND church_id = _church_id
      AND is_certified = true
  )
$$;

-- 1. DISCIPLESHIP PROGRAMS (12-week sanctuary-based programs)
CREATE TABLE public.discipleship_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  program_type TEXT NOT NULL DEFAULT 'sanctuary_12_week',
  sanctuary_focus TEXT,
  week_number INTEGER,
  theme TEXT,
  key_truth TEXT,
  scripture_focus TEXT[],
  phototheology_emphasis TEXT[],
  ellen_white_emphasis TEXT[],
  practices TEXT[],
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. DISCIPLESHIP COHORTS
CREATE TABLE public.discipleship_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.discipleship_programs(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES auth.users(id),
  co_leader_id UUID REFERENCES auth.users(id),
  start_date DATE,
  current_week INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'forming',
  max_members INTEGER DEFAULT 12,
  meeting_day TEXT,
  meeting_time TEXT,
  meeting_location TEXT,
  is_online BOOLEAN DEFAULT false,
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. COHORT MEMBERS
CREATE TABLE public.cohort_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID REFERENCES public.discipleship_cohorts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  member_pathway TEXT NOT NULL DEFAULT 'guest',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  attendance_count INTEGER DEFAULT 0,
  last_attendance TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(cohort_id, user_id)
);

-- 4. ATTENDANCE TRACKING
CREATE TABLE public.cohort_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID REFERENCES public.discipleship_cohorts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  session_date DATE NOT NULL,
  week_number INTEGER,
  attendance_status TEXT NOT NULL DEFAULT 'present',
  participation_level TEXT,
  notes TEXT,
  recorded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. SIX-WEEK CYCLES
CREATE TABLE public.six_week_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  cycle_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  week_content JSONB,
  is_template BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. CYCLE ENROLLMENTS
CREATE TABLE public.cycle_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID REFERENCES public.six_week_cycles(id) ON DELETE CASCADE NOT NULL,
  cohort_id UUID REFERENCES public.discipleship_cohorts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  current_week INTEGER DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active'
);

-- 7. MEMBER PATHWAY PROGRESSION
CREATE TABLE public.member_pathway_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  current_level TEXT NOT NULL DEFAULT 'guest',
  guest_started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  disciple_started_at TIMESTAMP WITH TIME ZONE,
  leader_started_at TIMESTAMP WITH TIME ZONE,
  trainer_started_at TIMESTAMP WITH TIME ZONE,
  programs_completed INTEGER DEFAULT 0,
  cycles_completed INTEGER DEFAULT 0,
  people_discipled INTEGER DEFAULT 0,
  baptism_date DATE,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(church_id, user_id)
);

-- 8. PRAYER TEAMS
CREATE TABLE public.prayer_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES auth.users(id),
  meeting_schedule TEXT,
  focus_area TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. PRAYER TEAM MEMBERS
CREATE TABLE public.prayer_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.prayer_teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT DEFAULT 'intercessor',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(team_id, user_id)
);

-- 10. CHURCH PRAYER REQUESTS (enhanced)
CREATE TABLE public.church_prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  team_id UUID REFERENCES public.prayer_teams(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  urgency TEXT DEFAULT 'normal',
  is_answered BOOLEAN DEFAULT false,
  answered_at TIMESTAMP WITH TIME ZONE,
  answer_testimony TEXT,
  is_public BOOLEAN DEFAULT true,
  prayer_count INTEGER DEFAULT 0,
  assigned_to UUID REFERENCES auth.users(id),
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. PRAYER ACTIVITY LOG
CREATE TABLE public.prayer_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.church_prayer_requests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  activity_type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 12. EVANGELISM CAMPAIGNS (enhanced)
CREATE TABLE public.evangelism_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  campaign_type TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  target_audience TEXT,
  location TEXT,
  is_online BOOLEAN DEFAULT false,
  meeting_link TEXT,
  series_content JSONB,
  status TEXT NOT NULL DEFAULT 'planning',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 13. EVANGELISM INTERESTS
CREATE TABLE public.evangelism_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.evangelism_campaigns(id) ON DELETE CASCADE,
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  interest_level TEXT DEFAULT 'curious',
  source TEXT,
  assigned_bible_worker UUID REFERENCES auth.users(id),
  first_contact DATE,
  last_contact DATE,
  total_studies INTEGER DEFAULT 0,
  baptism_interest BOOLEAN DEFAULT false,
  baptism_date DATE,
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 14. STUDY SESSIONS WITH INTERESTS
CREATE TABLE public.interest_study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interest_id UUID REFERENCES public.evangelism_interests(id) ON DELETE CASCADE NOT NULL,
  bible_worker_id UUID REFERENCES auth.users(id) NOT NULL,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  topic TEXT,
  scripture_covered TEXT[],
  duration_minutes INTEGER,
  decision_made TEXT,
  notes TEXT,
  next_session_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 15. MINISTRY TEMPLATES
CREATE TABLE public.ministry_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ministry_type TEXT NOT NULL,
  milestones JSONB,
  resources_needed TEXT[],
  team_roles JSONB,
  budget_estimate DECIMAL(10,2),
  is_template BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 16. MINISTRY LAUNCHES
CREATE TABLE public.ministry_launches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.ministry_templates(id),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'planning',
  launch_date DATE,
  milestone_progress JSONB,
  team_members JSONB,
  actual_budget DECIMAL(10,2),
  metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 17. LEADER ESCALATIONS
CREATE TABLE public.leader_escalations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  raised_by UUID REFERENCES auth.users(id) NOT NULL,
  cohort_id UUID REFERENCES public.discipleship_cohorts(id),
  member_id UUID REFERENCES auth.users(id),
  escalation_type TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'open',
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 18. BIBLE WORKER STUDY RELEASES
CREATE TABLE public.bible_worker_study_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  study_content JSONB NOT NULL,
  doctrinal_topics TEXT[],
  target_audience TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 19. BAPTISM PIPELINE
CREATE TABLE public.baptism_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  interest_id UUID REFERENCES public.evangelism_interests(id),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  bible_worker_id UUID REFERENCES auth.users(id),
  pastor_id UUID REFERENCES auth.users(id),
  stage TEXT NOT NULL DEFAULT 'studying',
  doctrinal_studies_completed TEXT[],
  baptism_class_completed BOOLEAN DEFAULT false,
  testimony_reviewed BOOLEAN DEFAULT false,
  pastoral_interview_date DATE,
  pastoral_interview_notes TEXT,
  scheduled_baptism_date DATE,
  actual_baptism_date DATE,
  baptism_location TEXT,
  certificate_issued BOOLEAN DEFAULT false,
  follow_up_assigned_to UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.discipleship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discipleship_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.six_week_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_pathway_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evangelism_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evangelism_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interest_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_launches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leader_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_worker_study_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baptism_candidates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Church members can view programs" ON public.discipleship_programs FOR SELECT USING (church_id IS NULL OR EXISTS (SELECT 1 FROM public.church_members WHERE church_id = discipleship_programs.church_id AND user_id = auth.uid()));
CREATE POLICY "Church admins can manage programs" ON public.discipleship_programs FOR ALL USING (created_by = auth.uid() OR public.is_church_admin(auth.uid(), church_id) OR public.is_certified_leader(auth.uid(), church_id));
CREATE POLICY "Church members can view cohorts" ON public.discipleship_cohorts FOR SELECT USING (EXISTS (SELECT 1 FROM public.church_members WHERE church_id = discipleship_cohorts.church_id AND user_id = auth.uid()));
CREATE POLICY "Leaders can manage cohorts" ON public.discipleship_cohorts FOR ALL USING (leader_id = auth.uid() OR co_leader_id = auth.uid() OR public.is_church_admin(auth.uid(), church_id));
CREATE POLICY "Cohort members can view their cohort members" ON public.cohort_members FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.discipleship_cohorts c WHERE c.id = cohort_members.cohort_id AND (c.leader_id = auth.uid() OR c.co_leader_id = auth.uid())));
CREATE POLICY "Leaders can manage cohort members" ON public.cohort_members FOR ALL USING (EXISTS (SELECT 1 FROM public.discipleship_cohorts c WHERE c.id = cohort_members.cohort_id AND (c.leader_id = auth.uid() OR c.co_leader_id = auth.uid() OR public.is_church_admin(auth.uid(), c.church_id))));
CREATE POLICY "Leaders can manage attendance" ON public.cohort_attendance FOR ALL USING (EXISTS (SELECT 1 FROM public.discipleship_cohorts c WHERE c.id = cohort_attendance.cohort_id AND (c.leader_id = auth.uid() OR c.co_leader_id = auth.uid() OR public.is_church_admin(auth.uid(), c.church_id))));
CREATE POLICY "Members can view own attendance" ON public.cohort_attendance FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Church members can view cycles" ON public.six_week_cycles FOR SELECT USING (is_template = true OR church_id IS NULL OR EXISTS (SELECT 1 FROM public.church_members WHERE church_id = six_week_cycles.church_id AND user_id = auth.uid()));
CREATE POLICY "Leaders can manage cycles" ON public.six_week_cycles FOR ALL USING (created_by = auth.uid() OR public.is_church_admin(auth.uid(), church_id));
CREATE POLICY "Users can view own enrollments" ON public.cycle_enrollments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own enrollments" ON public.cycle_enrollments FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view own pathway" ON public.member_pathway_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Church admins can view/manage pathways" ON public.member_pathway_progress FOR ALL USING (user_id = auth.uid() OR public.is_church_admin(auth.uid(), church_id) OR public.is_certified_leader(auth.uid(), church_id));
CREATE POLICY "Church members can view prayer teams" ON public.prayer_teams FOR SELECT USING (EXISTS (SELECT 1 FROM public.church_members WHERE church_id = prayer_teams.church_id AND user_id = auth.uid()));
CREATE POLICY "Leaders can manage prayer teams" ON public.prayer_teams FOR ALL USING (leader_id = auth.uid() OR public.is_church_admin(auth.uid(), church_id));
CREATE POLICY "Team members can view members" ON public.prayer_team_members FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.prayer_teams t WHERE t.id = prayer_team_members.team_id AND t.leader_id = auth.uid()));
CREATE POLICY "Leaders can manage team members" ON public.prayer_team_members FOR ALL USING (EXISTS (SELECT 1 FROM public.prayer_teams t WHERE t.id = prayer_team_members.team_id AND (t.leader_id = auth.uid() OR public.is_church_admin(auth.uid(), t.church_id))));
CREATE POLICY "Church members can view public prayer requests" ON public.church_prayer_requests FOR SELECT USING (user_id = auth.uid() OR (is_public = true AND EXISTS (SELECT 1 FROM public.church_members WHERE church_id = church_prayer_requests.church_id AND user_id = auth.uid())));
CREATE POLICY "Users can create prayer requests" ON public.church_prayer_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own requests" ON public.church_prayer_requests FOR UPDATE USING (user_id = auth.uid() OR assigned_to = auth.uid() OR public.is_church_admin(auth.uid(), church_id));
CREATE POLICY "Users can log prayer activity" ON public.prayer_activity_log FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can view prayer activity" ON public.prayer_activity_log FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.church_prayer_requests r WHERE r.id = prayer_activity_log.request_id AND r.user_id = auth.uid()));
CREATE POLICY "Church members can view campaigns" ON public.evangelism_campaigns FOR SELECT USING (EXISTS (SELECT 1 FROM public.church_members WHERE church_id = evangelism_campaigns.church_id AND user_id = auth.uid()));
CREATE POLICY "Leaders can manage campaigns" ON public.evangelism_campaigns FOR ALL USING (created_by = auth.uid() OR public.is_church_admin(auth.uid(), church_id) OR public.is_bible_worker(auth.uid(), church_id));
CREATE POLICY "Bible workers can view interests" ON public.evangelism_interests FOR SELECT USING (assigned_bible_worker = auth.uid() OR public.is_church_admin(auth.uid(), church_id) OR public.is_bible_worker(auth.uid(), church_id));
CREATE POLICY "Bible workers can manage interests" ON public.evangelism_interests FOR ALL USING (assigned_bible_worker = auth.uid() OR public.is_church_admin(auth.uid(), church_id) OR public.is_bible_worker(auth.uid(), church_id));
CREATE POLICY "Bible workers can manage study sessions" ON public.interest_study_sessions FOR ALL USING (bible_worker_id = auth.uid() OR EXISTS (SELECT 1 FROM public.evangelism_interests i WHERE i.id = interest_study_sessions.interest_id AND i.assigned_bible_worker = auth.uid()));
CREATE POLICY "Church members can view templates" ON public.ministry_templates FOR SELECT USING (is_template = true OR church_id IS NULL OR EXISTS (SELECT 1 FROM public.church_members WHERE church_id = ministry_templates.church_id AND user_id = auth.uid()));
CREATE POLICY "Leaders can manage templates" ON public.ministry_templates FOR ALL USING (created_by = auth.uid() OR public.is_church_admin(auth.uid(), church_id));
CREATE POLICY "Church members can view launches" ON public.ministry_launches FOR SELECT USING (EXISTS (SELECT 1 FROM public.church_members WHERE church_id = ministry_launches.church_id AND user_id = auth.uid()));
CREATE POLICY "Leaders can manage launches" ON public.ministry_launches FOR ALL USING (leader_id = auth.uid() OR public.is_church_admin(auth.uid(), church_id));
CREATE POLICY "Leaders can view escalations" ON public.leader_escalations FOR SELECT USING (raised_by = auth.uid() OR assigned_to = auth.uid() OR public.is_church_admin(auth.uid(), church_id));
CREATE POLICY "Leaders can manage escalations" ON public.leader_escalations FOR ALL USING (raised_by = auth.uid() OR assigned_to = auth.uid() OR public.is_church_admin(auth.uid(), church_id));
CREATE POLICY "Church members can view published releases" ON public.bible_worker_study_releases FOR SELECT USING (status = 'published' OR created_by = auth.uid() OR public.is_church_admin(auth.uid(), church_id));
CREATE POLICY "Bible workers can manage releases" ON public.bible_worker_study_releases FOR ALL USING (created_by = auth.uid() OR public.is_church_admin(auth.uid(), church_id) OR public.is_bible_worker(auth.uid(), church_id));
CREATE POLICY "Bible workers can view candidates" ON public.baptism_candidates FOR SELECT USING (user_id = auth.uid() OR bible_worker_id = auth.uid() OR pastor_id = auth.uid() OR public.is_church_admin(auth.uid(), church_id));
CREATE POLICY "Bible workers can manage candidates" ON public.baptism_candidates FOR ALL USING (bible_worker_id = auth.uid() OR pastor_id = auth.uid() OR public.is_church_admin(auth.uid(), church_id));

-- Create indexes
CREATE INDEX idx_discipleship_programs_church ON public.discipleship_programs(church_id);
CREATE INDEX idx_discipleship_cohorts_church ON public.discipleship_cohorts(church_id);
CREATE INDEX idx_cohort_members_cohort ON public.cohort_members(cohort_id);
CREATE INDEX idx_cohort_members_user ON public.cohort_members(user_id);
CREATE INDEX idx_cohort_attendance_cohort ON public.cohort_attendance(cohort_id);
CREATE INDEX idx_member_pathway_church_user ON public.member_pathway_progress(church_id, user_id);
CREATE INDEX idx_prayer_teams_church ON public.prayer_teams(church_id);
CREATE INDEX idx_church_prayer_requests_church ON public.church_prayer_requests(church_id);
CREATE INDEX idx_evangelism_campaigns_church ON public.evangelism_campaigns(church_id);
CREATE INDEX idx_evangelism_interests_church ON public.evangelism_interests(church_id);
CREATE INDEX idx_baptism_candidates_church ON public.baptism_candidates(church_id);

-- Trigger function
CREATE OR REPLACE FUNCTION public.update_living_manna_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers
CREATE TRIGGER update_discipleship_programs_updated_at BEFORE UPDATE ON public.discipleship_programs FOR EACH ROW EXECUTE FUNCTION public.update_living_manna_updated_at();
CREATE TRIGGER update_discipleship_cohorts_updated_at BEFORE UPDATE ON public.discipleship_cohorts FOR EACH ROW EXECUTE FUNCTION public.update_living_manna_updated_at();
CREATE TRIGGER update_church_prayer_requests_updated_at BEFORE UPDATE ON public.church_prayer_requests FOR EACH ROW EXECUTE FUNCTION public.update_living_manna_updated_at();
CREATE TRIGGER update_evangelism_campaigns_updated_at BEFORE UPDATE ON public.evangelism_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_living_manna_updated_at();
CREATE TRIGGER update_evangelism_interests_updated_at BEFORE UPDATE ON public.evangelism_interests FOR EACH ROW EXECUTE FUNCTION public.update_living_manna_updated_at();
CREATE TRIGGER update_ministry_templates_updated_at BEFORE UPDATE ON public.ministry_templates FOR EACH ROW EXECUTE FUNCTION public.update_living_manna_updated_at();
CREATE TRIGGER update_ministry_launches_updated_at BEFORE UPDATE ON public.ministry_launches FOR EACH ROW EXECUTE FUNCTION public.update_living_manna_updated_at();
CREATE TRIGGER update_leader_escalations_updated_at BEFORE UPDATE ON public.leader_escalations FOR EACH ROW EXECUTE FUNCTION public.update_living_manna_updated_at();
CREATE TRIGGER update_bible_worker_study_releases_updated_at BEFORE UPDATE ON public.bible_worker_study_releases FOR EACH ROW EXECUTE FUNCTION public.update_living_manna_updated_at();
CREATE TRIGGER update_baptism_candidates_updated_at BEFORE UPDATE ON public.baptism_candidates FOR EACH ROW EXECUTE FUNCTION public.update_living_manna_updated_at();
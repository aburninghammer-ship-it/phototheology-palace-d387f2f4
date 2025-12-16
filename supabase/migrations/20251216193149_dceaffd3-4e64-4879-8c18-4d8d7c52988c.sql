-- =============================================
-- LIVING MANNA YOUTH MINISTRY TABLES
-- =============================================

-- 1. YOUTH GROUPS (Age-Banded Small Groups)
CREATE TABLE public.youth_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  age_band TEXT NOT NULL CHECK (age_band IN ('juniors_13_16', 'seniors_17_20', 'young_adults_21_25')),
  status TEXT NOT NULL DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'completed', 'paused')),
  current_week INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 6,
  meeting_day TEXT,
  meeting_time TEXT,
  meeting_location TEXT,
  is_online BOOLEAN DEFAULT false,
  meeting_link TEXT,
  start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. YOUTH LEADERS (Vetted Adult Leaders)
CREATE TABLE public.youth_leaders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  group_id UUID REFERENCES public.youth_groups(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'leader' CHECK (role IN ('leader', 'co_leader', 'overseer', 'apprentice')),
  background_check_status TEXT DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'approved', 'expired', 'denied')),
  background_check_date DATE,
  training_completed BOOLEAN DEFAULT false,
  training_completed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(church_id, user_id)
);

-- 3. YOUTH MEMBERS
CREATE TABLE public.youth_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.youth_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  age INTEGER,
  parental_consent BOOLEAN DEFAULT false,
  parental_consent_date DATE,
  parent_contact_email TEXT,
  parent_contact_phone TEXT,
  member_pathway TEXT NOT NULL DEFAULT 'guest' CHECK (member_pathway IN ('guest', 'member', 'apprentice_leader', 'leader')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  attendance_count INTEGER DEFAULT 0,
  last_attendance TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  UNIQUE(group_id, user_id)
);

-- 4. YOUTH CURRICULUM WEEKS (12-Week Sanctuary Track)
CREATE TABLE public.youth_curriculum_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number INTEGER NOT NULL UNIQUE CHECK (week_number BETWEEN 1 AND 12),
  sanctuary_station TEXT NOT NULL,
  title TEXT NOT NULL,
  core_question TEXT,
  scripture_references TEXT[] NOT NULL,
  truth_statement TEXT NOT NULL,
  practice_activity TEXT,
  ew_theme TEXT,
  pt_focus TEXT,
  discussion_prompts TEXT[],
  application_challenge TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. YOUTH GROUP PROGRESS
CREATE TABLE public.youth_group_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.youth_groups(id) ON DELETE CASCADE NOT NULL,
  week_number INTEGER NOT NULL,
  session_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  led_by UUID REFERENCES auth.users(id),
  attendance_count INTEGER DEFAULT 0,
  session_notes TEXT,
  follow_up_needed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, week_number)
);

-- 6. YOUTH ATTENDANCE
CREATE TABLE public.youth_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.youth_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  session_date DATE NOT NULL,
  week_number INTEGER,
  attendance_status TEXT NOT NULL DEFAULT 'present' CHECK (attendance_status IN ('present', 'absent', 'excused', 'late')),
  participation_level TEXT CHECK (participation_level IN ('high', 'medium', 'low', 'observer')),
  notes TEXT,
  recorded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. YOUTH SAFETY LOGS (Incident Reports & Monitoring)
CREATE TABLE public.youth_safety_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.youth_groups(id) ON DELETE SET NULL,
  reported_by UUID REFERENCES auth.users(id) NOT NULL,
  log_type TEXT NOT NULL CHECK (log_type IN ('incident', 'concern', 'escalation', 'flagged_content', 'positive')),
  severity TEXT DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  subject_user_id UUID REFERENCES auth.users(id),
  description TEXT NOT NULL,
  action_taken TEXT,
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. YOUTH GUEST INVITES (Evangelism)
CREATE TABLE public.youth_guest_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.youth_groups(id) ON DELETE CASCADE NOT NULL,
  invited_by UUID REFERENCES auth.users(id) NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  invite_code TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'converted')),
  converted_to_member_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. YOUTH TRANSITION TRACKING (Youth → Adult)
CREATE TABLE public.youth_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  from_group_id UUID REFERENCES public.youth_groups(id) ON DELETE SET NULL,
  transition_stage TEXT NOT NULL DEFAULT 'readiness_review' CHECK (transition_stage IN ('readiness_review', 'bridge_track', 'observation', 'commissioning', 'completed')),
  leader_recommendation TEXT,
  leader_recommended_by UUID REFERENCES auth.users(id),
  bridge_track_started_at TIMESTAMP WITH TIME ZONE,
  bridge_track_completed_at TIMESTAMP WITH TIME ZONE,
  adult_cohort_id UUID REFERENCES public.discipleship_cohorts(id) ON DELETE SET NULL,
  commissioned_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(church_id, user_id)
);

-- 10. YOUTH 6-WEEK CYCLES (Post-Onboarding)
CREATE TABLE public.youth_study_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  cycle_type TEXT NOT NULL CHECK (cycle_type IN ('character_habits', 'bible_skills', 'prophecy_future', 'prayer_revival', 'identity_mental_health', 'evangelism_practicum')),
  title TEXT NOT NULL,
  description TEXT,
  week_count INTEGER DEFAULT 6,
  is_guest_friendly BOOLEAN DEFAULT true,
  materials_link TEXT,
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. YOUTH CYCLE ENROLLMENTS
CREATE TABLE public.youth_cycle_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID REFERENCES public.youth_study_cycles(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.youth_groups(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_week INTEGER DEFAULT 1,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  UNIQUE(cycle_id, group_id)
);

-- 12. YOUTH GROUP CHAT (Group-Only, No Private DMs)
CREATE TABLE public.youth_group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.youth_groups(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'prayer_request', 'encouragement', 'question', 'announcement')),
  content TEXT NOT NULL,
  is_flagged BOOLEAN DEFAULT false,
  flagged_reason TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all youth tables
ALTER TABLE public.youth_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth_curriculum_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth_group_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth_safety_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth_guest_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth_study_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth_cycle_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth_group_messages ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if user is youth leader
CREATE OR REPLACE FUNCTION public.is_youth_leader(_user_id uuid, _church_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.youth_leaders
    WHERE user_id = _user_id
      AND church_id = _church_id
      AND is_active = true
      AND background_check_status = 'approved'
  )
$$;

-- Helper function: Check if user is youth overseer
CREATE OR REPLACE FUNCTION public.is_youth_overseer(_user_id uuid, _church_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.youth_leaders
    WHERE user_id = _user_id
      AND church_id = _church_id
      AND role = 'overseer'
      AND is_active = true
  )
$$;

-- RLS Policies for youth_groups
CREATE POLICY "Church members can view youth groups"
ON public.youth_groups FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.church_members cm
    WHERE cm.church_id = youth_groups.church_id
    AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Youth leaders can manage their groups"
ON public.youth_groups FOR ALL
TO authenticated
USING (
  public.is_youth_leader(auth.uid(), church_id)
  OR public.is_church_admin(auth.uid(), church_id)
);

-- RLS Policies for youth_leaders
CREATE POLICY "Church admins can manage youth leaders"
ON public.youth_leaders FOR ALL
TO authenticated
USING (
  public.is_church_admin(auth.uid(), church_id)
  OR public.is_youth_overseer(auth.uid(), church_id)
);

CREATE POLICY "Users can view their own leader record"
ON public.youth_leaders FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for youth_members
CREATE POLICY "Youth leaders can view their group members"
ON public.youth_members FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.youth_groups yg
    JOIN public.youth_leaders yl ON yl.group_id = yg.id
    WHERE yg.id = youth_members.group_id
    AND yl.user_id = auth.uid()
    AND yl.is_active = true
  )
  OR user_id = auth.uid()
);

CREATE POLICY "Youth leaders can manage members"
ON public.youth_members FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.youth_groups yg
    JOIN public.youth_leaders yl ON yl.group_id = yg.id
    WHERE yg.id = youth_members.group_id
    AND yl.user_id = auth.uid()
    AND yl.is_active = true
  )
);

-- RLS Policies for youth_curriculum_weeks (read-only for all authenticated)
CREATE POLICY "Anyone can view curriculum"
ON public.youth_curriculum_weeks FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for youth_safety_logs
CREATE POLICY "Youth overseers can view safety logs"
ON public.youth_safety_logs FOR SELECT
TO authenticated
USING (
  public.is_youth_overseer(auth.uid(), church_id)
  OR public.is_church_admin(auth.uid(), church_id)
  OR reported_by = auth.uid()
);

CREATE POLICY "Anyone can report safety concerns"
ON public.youth_safety_logs FOR INSERT
TO authenticated
WITH CHECK (reported_by = auth.uid());

-- RLS Policies for youth_group_messages (GROUP ONLY - NO PRIVATE DMs)
CREATE POLICY "Group members can view messages"
ON public.youth_group_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.youth_members ym
    WHERE ym.group_id = youth_group_messages.group_id
    AND ym.user_id = auth.uid()
    AND ym.is_active = true
  )
  OR EXISTS (
    SELECT 1 FROM public.youth_leaders yl
    WHERE yl.group_id = youth_group_messages.group_id
    AND yl.user_id = auth.uid()
    AND yl.is_active = true
  )
);

CREATE POLICY "Group members can send messages"
ON public.youth_group_messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND (
    EXISTS (
      SELECT 1 FROM public.youth_members ym
      WHERE ym.group_id = youth_group_messages.group_id
      AND ym.user_id = auth.uid()
      AND ym.is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM public.youth_leaders yl
      WHERE yl.group_id = youth_group_messages.group_id
      AND yl.user_id = auth.uid()
      AND yl.is_active = true
    )
  )
);

-- Trigger for updating timestamps
CREATE TRIGGER update_youth_groups_updated_at
  BEFORE UPDATE ON public.youth_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_living_manna_updated_at();

CREATE TRIGGER update_youth_transitions_updated_at
  BEFORE UPDATE ON public.youth_transitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_living_manna_updated_at();
-- Sanctuary Journey Evangelistic Series Tables

-- Main series configuration
CREATE TABLE public.sanctuary_journey_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'The Sanctuary Journey',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  total_sessions INTEGER DEFAULT 12,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Individual session content
CREATE TABLE public.sanctuary_journey_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID REFERENCES public.sanctuary_journey_series(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  sanctuary_frame TEXT NOT NULL,
  primary_scriptures TEXT[] NOT NULL,
  core_truth TEXT NOT NULL,
  guided_insight TEXT NOT NULL,
  reflection_question TEXT NOT NULL,
  prayer_prompt TEXT NOT NULL,
  is_checkpoint BOOLEAN DEFAULT false,
  checkpoint_options JSONB,
  phase TEXT NOT NULL CHECK (phase IN ('gospel_foundation', 'daily_walk', 'most_holy_place', 'end_time_message')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(series_id, session_number)
);

-- User progress tracking
CREATE TABLE public.sanctuary_journey_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  series_id UUID REFERENCES public.sanctuary_journey_series(id) ON DELETE CASCADE,
  current_session INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  sponsor_user_id UUID,
  small_group_id UUID,
  journey_mode TEXT DEFAULT 'individual' CHECK (journey_mode IN ('individual', 'group', 'sponsored')),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Session completion records
CREATE TABLE public.sanctuary_journey_session_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  progress_id UUID REFERENCES public.sanctuary_journey_progress(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sanctuary_journey_sessions(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  reflection_response TEXT,
  time_spent_seconds INTEGER,
  ai_conversation_history JSONB DEFAULT '[]'::jsonb,
  UNIQUE(progress_id, session_id)
);

-- Escalation tracking for Bible workers
CREATE TABLE public.sanctuary_journey_escalations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  progress_id UUID REFERENCES public.sanctuary_journey_progress(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sanctuary_journey_sessions(id),
  escalation_type TEXT NOT NULL CHECK (escalation_type IN ('baptism_interest', 'doctrinal_question', 'emotional_distress', 'lifestyle_conflict', 'prayer_request', 'group_connection')),
  user_message TEXT,
  ai_detected_reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'resolved')),
  assigned_to UUID,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sanctuary_journey_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanctuary_journey_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanctuary_journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanctuary_journey_session_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanctuary_journey_escalations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for series (church members can view their church's series)
CREATE POLICY "Church members can view series" ON public.sanctuary_journey_series
  FOR SELECT USING (
    church_id IN (SELECT church_id FROM public.church_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Church admins can manage series" ON public.sanctuary_journey_series
  FOR ALL USING (
    public.is_church_admin(auth.uid(), church_id)
  );

-- RLS Policies for sessions (anyone with series access can view)
CREATE POLICY "Users can view sessions" ON public.sanctuary_journey_sessions
  FOR SELECT USING (
    series_id IN (
      SELECT id FROM public.sanctuary_journey_series 
      WHERE church_id IN (SELECT church_id FROM public.church_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Church admins can manage sessions" ON public.sanctuary_journey_sessions
  FOR ALL USING (
    series_id IN (
      SELECT id FROM public.sanctuary_journey_series 
      WHERE public.is_church_admin(auth.uid(), church_id)
    )
  );

-- RLS Policies for progress
CREATE POLICY "Users can view own progress" ON public.sanctuary_journey_progress
  FOR SELECT USING (user_id = auth.uid() OR sponsor_user_id = auth.uid());

CREATE POLICY "Users can manage own progress" ON public.sanctuary_journey_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Church admins can view all progress" ON public.sanctuary_journey_progress
  FOR SELECT USING (
    series_id IN (
      SELECT id FROM public.sanctuary_journey_series 
      WHERE public.is_church_admin(auth.uid(), church_id)
    )
  );

-- RLS Policies for session completions
CREATE POLICY "Users can view own completions" ON public.sanctuary_journey_session_completions
  FOR SELECT USING (
    progress_id IN (SELECT id FROM public.sanctuary_journey_progress WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage own completions" ON public.sanctuary_journey_session_completions
  FOR ALL USING (
    progress_id IN (SELECT id FROM public.sanctuary_journey_progress WHERE user_id = auth.uid())
  );

-- RLS Policies for escalations
CREATE POLICY "Users can view own escalations" ON public.sanctuary_journey_escalations
  FOR SELECT USING (
    progress_id IN (SELECT id FROM public.sanctuary_journey_progress WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create escalations" ON public.sanctuary_journey_escalations
  FOR INSERT WITH CHECK (
    progress_id IN (SELECT id FROM public.sanctuary_journey_progress WHERE user_id = auth.uid())
  );

CREATE POLICY "Church admins and Bible workers can manage escalations" ON public.sanctuary_journey_escalations
  FOR ALL USING (
    progress_id IN (
      SELECT p.id FROM public.sanctuary_journey_progress p
      JOIN public.sanctuary_journey_series s ON p.series_id = s.id
      WHERE public.is_church_admin(auth.uid(), s.church_id)
         OR public.is_bible_worker(auth.uid(), s.church_id)
    )
  );

-- Create indexes
CREATE INDEX idx_journey_progress_user ON public.sanctuary_journey_progress(user_id);
CREATE INDEX idx_journey_progress_series ON public.sanctuary_journey_progress(series_id);
CREATE INDEX idx_journey_escalations_status ON public.sanctuary_journey_escalations(status);
CREATE INDEX idx_journey_sessions_series ON public.sanctuary_journey_sessions(series_id, session_number);